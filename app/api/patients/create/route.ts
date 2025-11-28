import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(request: NextRequest) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    const data = await request.json();
    
    console.log('Creating patient with data:', data);

    // Insert patient
    const result = await client.query(
      `INSERT INTO patients (
        file_number, age_years, age_months, gender, 
        height, weight, ethnicity, 
        birth_weight, gestational_age, cord_fall_day,
        parental_consanguinity,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING id, file_number`,
      [
        data.fileNumber,
        parseInt(data.ageYears) || 0,
        parseInt(data.ageMonths) || 0,
        data.gender,
        data.height ? parseFloat(data.height) : null,
        data.weight ? parseFloat(data.weight) : null,
        data.ethnicity || null,
        data.birthWeight ? parseFloat(data.birthWeight) : null,
        data.gestationalAge ? parseInt(data.gestationalAge) : null,
        data.cordFallDay ? parseInt(data.cordFallDay) : null,
        data.parentalConsanguinity || '0'
      ]
    );

    const patient = result.rows[0];
    console.log('Patient created:', patient);

    await client.end();

    return NextResponse.json({ 
      success: true,
      message: 'Hasta başarıyla kaydedildi', 
      id: patient.id,
      fileNumber: patient.file_number
    });
  } catch (error) {
    console.error('Hasta kaydedilemedi:', error);
    try {
      await client.end();
    } catch (e) {
      // ignore
    }
    return NextResponse.json(
      { 
        error: 'Hasta kaydedilemedi',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}

