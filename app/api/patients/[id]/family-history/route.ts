import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const patientId = parseInt(params.id);

    // Önce mevcut aile öyküsünü kontrol et
    const existingHistory = await prisma.familyHistory.findFirst({
      where: { patientId }
    });

    let familyHistory;
    if (existingHistory) {
      // Varsa güncelle
      familyHistory = await prisma.familyHistory.update({
        where: { id: existingHistory.id },
        data: {
          familyIeiHistory: data.familyIeiHistory,
          ieiRelationship: data.ieiRelationship,
          ieiType: data.ieiType,
          familyEarlyDeath: data.familyEarlyDeath,
          earlyDeathAge: data.earlyDeathAge,
          earlyDeathRelationship: data.earlyDeathRelationship,
          earlyDeathCause: data.earlyDeathCause,
          otherConditions: data.otherConditions
        }
      });
    } else {
      // Yoksa yeni kayıt oluştur
      familyHistory = await prisma.familyHistory.create({
        data: {
          patientId,
          familyIeiHistory: data.familyIeiHistory,
          ieiRelationship: data.ieiRelationship,
          ieiType: data.ieiType,
          familyEarlyDeath: data.familyEarlyDeath,
          earlyDeathAge: data.earlyDeathAge,
          earlyDeathRelationship: data.earlyDeathRelationship,
          earlyDeathCause: data.earlyDeathCause,
          otherConditions: data.otherConditions
        }
      });
    }

    return NextResponse.json({ 
      message: 'Aile öyküsü başarıyla kaydedildi',
      familyHistory 
    });
  } catch (error) {
    console.error('Error saving family history:', error);
    return NextResponse.json(
      { error: 'Aile öyküsü kaydedilemedi' }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 