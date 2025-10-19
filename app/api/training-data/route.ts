import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

