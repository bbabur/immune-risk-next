import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patientId = parseInt(id);

    if (isNaN(patientId)) {
      return NextResponse.json({ error: 'Geçersiz hasta ID' }, { status: 400 });
    }

    // Hasta temel bilgilerini al (include'lar geçici olarak kaldırıldı)
    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient) {
      return NextResponse.json({ error: 'Hasta bulunamadı' }, { status: 404 });
    }

    // Format the response
    const formattedPatient = {
      ...patient,
      birth_date: patient.birthDate,
      consanguinity: patient.parentalConsanguinity
    };

    return NextResponse.json(formattedPatient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 