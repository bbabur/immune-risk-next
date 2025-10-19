import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Tek training data getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    const trainingPatient = await prisma.trainingPatient.findUnique({
      where: { id }
    });

    if (!trainingPatient) {
      return NextResponse.json(
        { error: 'Kayıt bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(trainingPatient);
  } catch (error) {
    console.error('Training data getirme hatası:', error);
    return NextResponse.json(
      { error: 'Veri getirme başarısız' },
      { status: 500 }
    );
  }
}

// PUT - Training data güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    const trainingPatient = await prisma.trainingPatient.update({
      where: { id },
      data: body
    });

    return NextResponse.json(trainingPatient);
  } catch (error) {
    console.error('Training data güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Güncelleme başarısız', details: error instanceof Error ? error.message : 'Bilinmeyen hata' },
      { status: 500 }
    );
  }
}

// DELETE - Tek training data sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    await prisma.trainingPatient.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Kayıt silindi' });
  } catch (error) {
    console.error('Training data silme hatası:', error);
    return NextResponse.json(
      { error: 'Silme başarısız' },
      { status: 500 }
    );
  }
}

