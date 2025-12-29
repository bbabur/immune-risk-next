import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { sanitizeString, checkRateLimit } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Input validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Kullanıcı adı ve şifre gerekli' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedUsername = sanitizeString(username.trim());
    
    // Rate limiting - max 5 attempts per minute per IP
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`login:${clientIp}`, 5, 60000)) {
      return NextResponse.json(
        { error: 'Çok fazla deneme. Lütfen 1 dakika bekleyin.' },
        { status: 429 }
      );
    }

    // Find user by username or email (Prisma uses parameterized queries - SQL injection safe)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: sanitizedUsername },
          { email: sanitizedUsername }
        ]
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Hesabınız devre dışı' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Geçersiz şifre' },
        { status: 401 }
      );
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Create token
    const userData = {
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      role: user.role
    };

    const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      ...userData,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
      iat: Math.floor(Date.now() / 1000)
    }));
    const token = `${header}.${payload}.signature`;

    return NextResponse.json({
      success: true,
      user: userData,
      token
    });

  } catch (error) {
    console.error('Login hatası:', error);
    
    // Prisma bağlantı hatası kontrolü
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
    
    if (errorMessage.includes('connect') || errorMessage.includes('Connection')) {
      console.error('Veritabanı bağlantı hatası:', errorMessage);
      return NextResponse.json(
        { error: 'Veritabanına bağlanılamadı. Lütfen daha sonra tekrar deneyin.' },
        { status: 503 }
      );
    }
    
    if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
      console.error('Veritabanı timeout hatası:', errorMessage);
      return NextResponse.json(
        { error: 'İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.' },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: 'Giriş başarısız. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}

