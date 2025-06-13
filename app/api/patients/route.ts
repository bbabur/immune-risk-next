import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Use raw SQL to bypass character encoding issues
    const patients = await prisma.$queryRaw`
      SELECT 
        id,
        first_name as firstName,
        last_name as lastName,
        birth_date as birthDate,
        gender,
        final_risk_level as finalRiskLevel,
        has_immune_deficiency as hasImmuneDeficiency,
        diagnosis_type as diagnosisType
      FROM patients 
      ORDER BY id
    `;

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ error: 'Hasta listesi alınamadı' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Yaş bilgisini doğum tarihine çevir
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - parseInt(data.age);
    const birthDate = `${birthYear}-01-01`;

    const patient = await prisma.patient.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        birthDate: birthDate,
        gender: data.gender,
        height: parseFloat(data.height) || null,
        weight: parseFloat(data.weight) || null,
        ethnicity: data.ethnicity || null,
        birthWeight: parseFloat(data.birthWeight) || null,
        gestationalAge: parseInt(data.gestationalAge) || null,
        cordFallDay: parseInt(data.cordFallDay) || null,
        parentalConsanguinity: data.consanguinity === 'true',
        hasImmuneDeficiency: null,
        diagnosisType: 'CVID',
        finalRiskLevel: 'unknown'
      }
    });

    return NextResponse.json({ 
      message: 'Hasta başarıyla kaydedildi', 
      patient: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName
      }
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: 'Hasta kaydedilemedi' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 