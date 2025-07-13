import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const patientId = parseInt(params.id);

    const clinicalFeature = await prisma.clinicalFeature.create({
      data: {
        patientId,
        growthFailure: data.growthFailure,
        heightPercentile: data.heightPercentile,
        weightPercentile: data.weightPercentile,
        chronicSkinIssue: data.chronicSkinIssue,
        skinIssueType: data.skinIssueType,
        skinIssueDuration: data.skinIssueDuration,
        chronicDiarrhea: data.chronicDiarrhea,
        diarrheaDuration: data.diarrheaDuration,
        bcgLymphadenopathy: data.bcgLymphadenopathy,
        persistentThrush: data.persistentThrush,
        deepAbscesses: data.deepAbscesses,
        abscessLocation: data.abscessLocation,
        chd: data.chd,
        chdType: data.chdType,
      },
    });

    return NextResponse.json(clinicalFeature);
  } catch (error) {
    console.error('Klinik özellikler kaydedilemedi:', error);
    return NextResponse.json(
      { error: 'Klinik özellikler kaydedilemedi' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = parseInt(params.id);
    const clinicalFeatures = await prisma.clinicalFeature.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(clinicalFeatures);
  } catch (error) {
    console.error('Klinik özellikler alınamadı:', error);
    return NextResponse.json(
      { error: 'Klinik özellikler alınamadı' },
      { status: 500 }
    );
  }
} 