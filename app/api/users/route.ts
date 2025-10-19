import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { 
  sanitizeString, 
  validateEmail, 
  validateUsername, 
  validatePassword,
  checkRateLimit 
} from '@/lib/validation';

// GET - Tüm kullanıcıları getir
export async function GET() {
  try {
    // Prisma uses parameterized queries - SQL injection safe
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        // NEVER send password hash to client
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Kullanıcılar getirilemedi:', error);
    return NextResponse.json(
      { error: 'Kullanıcılar getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni kullanıcı ekle
export async function POST(request: NextRequest) {
  try {
    const { username, email, password, role } = await request.json();

    // Input validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedUsername = sanitizeString(username.trim());
    const sanitizedEmail = sanitizeString(email.trim().toLowerCase());
    const sanitizedRole = sanitizeString(role || 'user');

    // Validate format
    if (!validateUsername(sanitizedUsername)) {
      return NextResponse.json(
        { error: 'Kullanıcı adı geçersiz (3-30 karakter, sadece harf, rakam, _ ve -)' },
        { status: 400 }
      );
    }

    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Email formatı geçersiz' },
        { status: 400 }
      );
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        { error: 'Şifre en az 8 karakter olmalıdır' },
        { status: 400 }
      );
    }

    // Whitelist role values
    if (!['user', 'admin'].includes(sanitizedRole)) {
      return NextResponse.json(
        { error: 'Geçersiz rol' },
        { status: 400 }
      );
    }

    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`create-user:${clientIp}`, 10, 60000)) {
      return NextResponse.json(
        { error: 'Çok fazla istek. Lütfen bekleyin.' },
        { status: 429 }
      );
    }

    // Check if username or email already exists (Prisma uses parameterized queries)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: sanitizedUsername },
          { email: sanitizedEmail }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu kullanıcı adı veya email zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Hash password with bcrypt (protects against rainbow table attacks)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with Prisma (SQL injection safe via parameterized queries)
    const user = await prisma.user.create({
      data: {
        username: sanitizedUsername,
        email: sanitizedEmail,
        password: hashedPassword,
        role: sanitizedRole,
        isActive: true
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
        // NEVER return password hash
      }
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Kullanıcı eklenemedi:', error);
    return NextResponse.json(
      { error: 'Kullanıcı eklenemedi' },
      { status: 500 }
    );
  }
}

