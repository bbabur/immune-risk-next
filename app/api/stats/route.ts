import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Toplam hasta sayısı
    const patientCount = await prisma.patient.count();
    
    // Tanı konulmuş hasta sayısı (diagnosisType alanı dolu olanlar)
    const diagnosedCount = await prisma.patient.count({
      where: {
        diagnosisType: {
          not: null
        }
      }
    });

    // Model durumu (şimdilik statik, ileride gerçek model kontrolü yapılabilir)
    const modelExists = patientCount > 5; // 5'ten fazla hasta varsa model aktif kabul et

    return NextResponse.json({
      patientCount,
      diagnosedCount,
      modelExists
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 