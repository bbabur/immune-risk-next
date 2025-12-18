import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Kullanıcı bilgilerini getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLogin: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Kullanıcı getirilemedi:', error);
    return NextResponse.json(
      { error: 'Kullanıcı getirilemedi' },
      { status: 500 }
    );
  }
}

// DELETE - Tek kullanıcı silme (önyüzden izinli)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Admin kullanıcıları koruma (id=1 ve id=2 silinemez)
    if (id <= 2) {
      return NextResponse.json(
        { error: 'Sistem yöneticileri silinemez' },
        { status: 403 }
      );
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Kullanıcı silindi' });
  } catch (error) {
    console.error('Kullanıcı silinemedi:', error);
    return NextResponse.json(
      { error: 'Kullanıcı silinemedi' },
      { status: 500 }
    );
  }
}

