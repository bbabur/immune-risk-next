import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    const { searchParams } = new URL(request.url);
    const diagnosed = searchParams.get('diagnosed');
    
    if (diagnosed === 'true') {
      // Tanı konulmuş hastaları say
      const result = await client.query(
        'SELECT COUNT(*) as count FROM patients WHERE has_immune_deficiency = true'
      );
      await client.end();
      return NextResponse.json({ count: parseInt(result.rows[0].count) });
    } else {
      // Tüm hastaları getir
      const result = await client.query(`
        SELECT 
          id, file_number, age_years, age_months, gender,
          has_immune_deficiency, diagnosis_type, 
          birth_weight, gestational_age, parental_consanguinity,
          final_risk_level, created_at
        FROM patients
        ORDER BY id DESC
      `);
      await client.end();
      return NextResponse.json(result.rows);
    }
  } catch (error) {
    console.error('Hastalar alınamadı:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      url: request.url
    });
    try {
      await client.end();
    } catch (e) {
      // ignore
    }
    return NextResponse.json(
      { 
        error: 'Hastalar alınamadı',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}

// POST endpoint moved to /api/patients/create 