import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patientId = parseInt(id);

    if (isNaN(patientId)) {
      return NextResponse.json({ error: 'Geçersiz hasta ID' }, { status: 400 });
    }

    const data = await request.json();

    const clinicalFeature = await prisma.clinicalFeature.create({
      data: {
        patientId: patientId,
        dateRecorded: new Date(data.dateRecorded || new Date()),
        growthFailure: data.growthFailure || false,
        heightPercentile: data.heightPercentile ? parseFloat(data.heightPercentile) : null,
        weightPercentile: data.weightPercentile ? parseFloat(data.weightPercentile) : null,
        chronicSkinIssue: data.chronicSkinIssue || false,
        skinIssueType: data.skinIssueType || null,
        skinIssueDuration: data.skinIssueDuration ? parseInt(data.skinIssueDuration) : null,
        chronicDiarrhea: data.chronicDiarrhea || false,
        diarrheaDuration: data.diarrheaDuration ? parseInt(data.diarrheaDuration) : null,
        bcgLymphadenopathy: data.bcgLymphadenopathy || false,
        persistentThrush: data.persistentThrush || false,
        deepAbscesses: data.deepAbscesses || false,
        abscessLocation: data.abscessLocation || null,
        chd: data.chd || false,
        chdType: data.chdType || null
      }
    });

    return NextResponse.json({
      message: 'Klinik özellik başarıyla eklendi',
      clinicalFeature
    });
  } catch (error) {
    console.error('Error creating clinical feature:', error);
    return NextResponse.json({ error: 'Klinik özellik eklenemedi' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

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

    const clinicalFeatures = await prisma.clinicalFeature.findMany({
      where: { patientId: patientId },
      orderBy: { dateRecorded: 'desc' }
    });

    return NextResponse.json(clinicalFeatures);
  } catch (error) {
    console.error('Error fetching clinical features:', error);
    return NextResponse.json({ error: 'Klinik özellikler alınamadı' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 