import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

export async function POST() {
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

