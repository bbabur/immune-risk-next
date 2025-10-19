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

    // Hasta bilgilerini ilişkili verilerle al
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        clinicalFeatures: {
          orderBy: { dateRecorded: 'desc' }
        },
        familyHistory: true,
        hospitalizations: {
          orderBy: { admissionDate: 'desc' }
        },
        infections: {
          orderBy: { dateRecorded: 'desc' }
        },
        labResults: {
          orderBy: { testDate: 'desc' }
        },
        treatments: {
          orderBy: { startDate: 'desc' }
        },
        vaccinations: {
          orderBy: { vaccineDate: 'desc' }
        },
        riskAssessments: {
          orderBy: { assessmentDate: 'desc' }
        }
      }
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