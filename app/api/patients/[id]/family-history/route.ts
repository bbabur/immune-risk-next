import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const patientId = parseInt(resolvedParams.id);
    const body = await request.json();

    if (isNaN(patientId)) {
      return NextResponse.json({ error: 'Geçersiz hasta ID' }, { status: 400 });
    }

    // Hasta var mı kontrol et
    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient) {
      return NextResponse.json({ error: 'Hasta bulunamadı' }, { status: 404 });
    }

    // Aile öyküsünü kaydet
    const familyHistory = await prisma.familyHistory.create({
      data: {
        patientId: patientId,
        familyIeiHistory: body.familyIeiHistory || false,
        ieiRelationship: body.ieiRelationship || null,
        ieiType: body.ieiType || null,
        familyEarlyDeath: body.familyEarlyDeath || false,
        earlyDeathAge: body.earlyDeathAge ? parseInt(body.earlyDeathAge) : null,
        earlyDeathRelationship: body.earlyDeathRelationship || null,
        earlyDeathCause: body.earlyDeathCause || null,
        otherConditions: body.otherConditions || null
      }
    });

    return NextResponse.json(familyHistory);
  } catch (error) {
    console.error('Error creating family history:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const patientId = parseInt(resolvedParams.id);

    if (isNaN(patientId)) {
      return NextResponse.json({ error: 'Geçersiz hasta ID' }, { status: 400 });
    }

    const familyHistory = await prisma.familyHistory.findMany({
      where: { patientId: patientId }
    });

    return NextResponse.json(familyHistory);
  } catch (error) {
    console.error('Error fetching family history:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 