import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    const patientId = parseInt(params.id);
    
    // Get latest risk assessment
    const result = await client.query(
      `SELECT * FROM risk_assessments 
       WHERE patient_id = $1 
       ORDER BY assessment_date DESC 
       LIMIT 1`,
      [patientId]
    );

    await client.end();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Risk değerlendirmesi bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Risk assessment fetch error:', error);
    try {
      await client.end();
    } catch (e) {
      // ignore
    }
    return NextResponse.json(
      { error: 'Risk değerlendirmesi alınamadı' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    const patientId = parseInt(params.id);
    
    console.log('Creating risk assessment for patient:', patientId);

    // Simple rule-based scoring (placeholder)
    const ruleBasedScore = Math.floor(Math.random() * 10) + 1; // TODO: Implement actual scoring
    const mlScore = Math.random(); // TODO: Implement ML model
    
    let finalRiskLevel = 'Düşük';
    if (ruleBasedScore >= 7 || mlScore >= 0.7) {
      finalRiskLevel = 'Yüksek';
    } else if (ruleBasedScore >= 4 || mlScore >= 0.4) {
      finalRiskLevel = 'Orta';
    }

    // Create risk assessment
    const result = await client.query(
      `INSERT INTO risk_assessments (
        patient_id,
        assessment_date,
        rule_based_score,
        ml_score,
        final_risk_level,
        recommendations,
        created_at
      ) VALUES ($1, NOW(), $2, $3, $4, $5, NOW())
      RETURNING *`,
      [
        patientId,
        ruleBasedScore,
        mlScore,
        finalRiskLevel,
        JSON.stringify([
          'Hasta takibi önerilir',
          'Klinik değerlendirme yapılmalıdır',
          'Laboratuvar testleri tekrarlanabilir'
        ])
      ]
    );

    // Update patient record
    await client.query(
      `UPDATE patients 
       SET rule_based_score = $1, ml_score = $2, final_risk_level = $3, updated_at = NOW()
       WHERE id = $4`,
      [ruleBasedScore, mlScore, finalRiskLevel, patientId]
    );

    await client.end();

    console.log('Risk assessment created successfully');

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Risk assessment creation error:', error);
    try {
      await client.end();
    } catch (e) {
      // ignore
    }
    return NextResponse.json(
      { 
        error: 'Risk değerlendirmesi oluşturulamadı',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}

