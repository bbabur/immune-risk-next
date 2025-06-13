import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // Use raw SQL to bypass character encoding issues
    const patients = await prisma.$queryRaw`
      SELECT 
        id,
        first_name as firstName,
        last_name as lastName,
        birth_date as birthDate,
        gender,
        height,
        weight,
        ethnicity,
        birth_weight as birthWeight,
        gestational_age as gestationalAge,
        cord_fall_day as cordFallDay,
        parental_consanguinity as parentalConsanguinity,
        rule_based_score as ruleBasedScore,
        ml_score as mlScore,
        final_risk_level as finalRiskLevel,
        has_immune_deficiency as hasImmuneDeficiency,
        diagnosis_type as diagnosisType,
        diagnosis_date as diagnosisDate
      FROM patients 
      WHERE id = ${patientId}
      LIMIT 1
    `;

    if (!patients || patients.length === 0) {
      return NextResponse.json({ error: 'Hasta bulunamadı' }, { status: 404 });
    }

    const patient = patients[0];

    // Format the response
    const formattedPatient = {
      ...patient,
      birth_date: patient.birthDate,
      consanguinity: patient.parentalConsanguinity,
      // Add empty arrays for related data until we fix the relations
      clinicalFeatures: [],
      familyHistory: [],
      hospitalizations: [],
      infections: [],
      labResults: [],
      treatments: [],
      vaccinations: [],
      riskAssessments: []
    };

    return NextResponse.json(formattedPatient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 