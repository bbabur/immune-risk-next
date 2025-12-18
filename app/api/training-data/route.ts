import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Tüm training data'yı getir
export async function GET() {
  try {
    const trainingData = await prisma.trainingPatient.findMany({
      orderBy: {
        id: 'asc'
      }
    });

    return NextResponse.json(trainingData);
  } catch (error) {
    console.error('Training data getirme hatası:', error);
    return NextResponse.json(
      { error: 'Veri getirme başarısız' },
      { status: 500 }
    );
  }
}

// POST - Yeni training data ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const trainingPatient = await prisma.trainingPatient.create({
      data: body
    });

    return NextResponse.json(trainingPatient, { status: 201 });
  } catch (error) {
    console.error('Training data ekleme hatası:', error);
    return NextResponse.json(
      { error: 'Veri ekleme başarısız', details: error instanceof Error ? error.message : 'Bilinmeyen hata' },
      { status: 500 }
    );
  }
}

// DELETE - Devre dışı bırakıldı (veri kaybını önlemek için)
export async function DELETE() {
  return NextResponse.json(
    { error: 'Toplu silme işlemi güvenlik nedeniyle devre dışı bırakıldı. Tek tek silme için /api/training-data/[id] kullanın.' },
    { status: 403 }
  );
}

