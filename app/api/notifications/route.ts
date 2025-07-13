import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Bildirimleri getir
export async function GET() {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      take: 50 // Son 50 bildirim
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Bildirimler getirilemedi:', error);
    return NextResponse.json(
      { error: 'Bildirimler getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni bildirim oluştur
export async function POST(request: Request) {
  try {
    const { title, message, type, patientId, category, data } = await request.json();

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type: type || 'info',
        patientId,
        category: category || 'system',
        data: data || null
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Bildirim oluşturulamadı:', error);
    return NextResponse.json(
      { error: 'Bildirim oluşturulamadı' },
      { status: 500 }
    );
  }
} 