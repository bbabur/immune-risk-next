import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

function requireAdminToken(request: NextRequest): boolean {
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role === 'admin' && payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!requireAdminToken(request)) {
    return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
  }
  try {
    // Hash passwords
    const adminPassword = await bcrypt.hash('Admin123456', 10);
    const userPassword = await bcrypt.hash('Mehmet123456', 10);

    let created = 0;
    let skipped = 0;

    // Upsert admin user - sadece yoksa ekle, varsa dokunma
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    });

    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@example.com',
          password: adminPassword,
          role: 'admin',
          isActive: true,
        }
      });
      created++;
    } else {
      skipped++;
    }

    // Upsert mehmetbabur user - sadece yoksa ekle, varsa dokunma
    const existingMehmet = await prisma.user.findUnique({
      where: { email: 'mehmetbabur@example.com' }
    });

    if (!existingMehmet) {
      await prisma.user.create({
        data: {
          username: 'mehmetbabur',
          email: 'mehmetbabur@example.com',
          password: userPassword,
          role: 'admin',
          isActive: true,
        }
      });
      created++;
    } else {
      skipped++;
    }

    return NextResponse.json({
      success: true,
      message: `Seed tamamlandı: ${created} yeni kullanıcı eklendi, ${skipped} kullanıcı zaten mevcut`,
      created,
      skipped
    });
  } catch (error) {
    console.error('User seed hatası:', error);
    return NextResponse.json(
      { error: 'Seed başarısız', details: error instanceof Error ? error.message : 'Bilinmeyen hata' },
      { status: 500 }
    );
  }
}

