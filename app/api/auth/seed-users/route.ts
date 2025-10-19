import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

export async function POST() {
  try {
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('YapayZeka3468*', 10);

    // Delete existing users
    await prisma.user.deleteMany({});

    // Create users - both as admin
    const users = await prisma.user.createMany({
      data: [
        {
          username: 'admin',
          email: 'admin@example.com',
          password: adminPassword,
          role: 'admin',
          isActive: true,
        },
        {
          username: 'mehmetbabur',
          email: 'mehmetbabur@example.com',
          password: userPassword,
          role: 'admin',
          isActive: true,
        }
      ]
    });

    return NextResponse.json({
      success: true,
      message: 'Kullanıcılar başarıyla oluşturuldu',
      count: users.count
    });
  } catch (error) {
    console.error('User seed hatası:', error);
    return NextResponse.json(
      { error: 'Seed başarısız', details: error instanceof Error ? error.message : 'Bilinmeyen hata' },
      { status: 500 }
    );
  }
}

