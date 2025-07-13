import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const diagnosed = searchParams.get('diagnosed');
    
    if (diagnosed === 'true') {
      // Tanı konulmuş hastaları say (hasImmuneDeficiency true olanlar)
      const count = await prisma.patient.count({
        where: {
          hasImmuneDeficiency: true
        }
      });
      return NextResponse.json({ count });
    } else {
      // Tüm hastaları getir/say
      const patients = await prisma.patient.findMany();
      return NextResponse.json(patients);
    }
  } catch (error) {
    console.error('Hastalar alınamadı:', error);
    return NextResponse.json(
      { error: 'Hastalar alınamadı' },
      { status: 500 }
    );
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

    // Bildirim oluştur
    await prisma.notification.create({
      data: {
        title: 'Yeni Hasta Kaydı',
        message: `${data.firstName} ${data.lastName} adlı hasta sisteme kaydedildi`,
        type: 'success',
        category: 'hasta_kaydi',
        patientId: patient.id,
        data: {
          patientId: patient.id,
          action: 'patient_created'
        }
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