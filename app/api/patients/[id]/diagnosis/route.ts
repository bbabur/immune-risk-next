import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = parseInt(params.id);

    if (isNaN(patientId)) {
      return NextResponse.json(
        { error: 'Invalid patient ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      hasImmuneDeficiency,
      diagnosisType,
      diagnosisDate,
    } = body;

    // Check if patient exists
    const existingPatient = await prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!existingPatient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // Update patient diagnosis exactly like Flask version
    const updatedPatient = await prisma.patient.update({
      where: {
        id: patientId,
      },
      data: {
        hasImmuneDeficiency: hasImmuneDeficiency,
        diagnosisType: diagnosisType || null,
        diagnosisDate: diagnosisDate || null,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Tanı bilgileri başarıyla güncellendi.',
      patient: updatedPatient,
    });
  } catch (error) {
    console.error('Error updating diagnosis:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

