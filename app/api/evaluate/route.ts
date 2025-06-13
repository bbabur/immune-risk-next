import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      patientId,
      totalNeutrophils,
      totalLymphocytes,
      igG,
      igA,
      igM,
      igE
    } = body;

    // Basit bir risk değerlendirmesi (Flask projesindeki gibi)
    let score = 0;
    
    if (totalNeutrophils && totalNeutrophils < 1500) {
      score += 2;
    }
    if (totalLymphocytes && totalLymphocytes < 1000) {
      score += 3;
    }
    if (igG && igG < 600) {
      score += 2;
    }
    if (igA && igA < 50) {
      score += 1;
    }
    if (igM && igM < 40) {
      score += 1;
    }
    if (igE && igE > 200) {
      score += 2; // Aşırı yüksek IgE riski
    }

    // Risk seviyesini belirle
    let riskLevel = 'Düşük Risk';
    if (score >= 6) {
      riskLevel = 'Yüksek Risk';
    } else if (score >= 3) {
      riskLevel = 'Orta Risk';
    }

    return NextResponse.json({
      score,
      riskLevel,
      message: `Laboratuvar değerlendirmesi tamamlandı! Risk seviyesi: ${riskLevel}`
    });
  } catch (error) {
    console.error('Error evaluating patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 