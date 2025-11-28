import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

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
    const data = await request.json();
    const patientId = parseInt(params.id);
    
    console.log('Saving lab results for patient:', patientId);

    // Save lab results
    await client.query(
      `INSERT INTO lab_results (
        patient_id,
        test_name,
        test_value,
        test_unit,
        test_date,
        created_at
      ) VALUES 
        ($1, 'Total Leukocyte', $2, 'cells/μL', NOW(), NOW()),
        ($1, 'Total Neutrophil', $3, 'cells/μL', NOW(), NOW()),
        ($1, 'Total Lymphocyte', $4, 'cells/μL', NOW(), NOW()),
        ($1, 'Total Eosinophil', $5, 'cells/μL', NOW(), NOW()),
        ($1, 'Total Platelet', $6, 'cells/μL', NOW(), NOW()),
        ($1, 'IgG', $7, 'mg/dL', NOW(), NOW()),
        ($1, 'IgE', $8, 'IU/mL', NOW(), NOW()),
        ($1, 'IgM', $9, 'mg/dL', NOW(), NOW()),
        ($1, 'IgA', $10, 'mg/dL', NOW(), NOW()),
        ($1, 'Anti-HBS', $11, 'mIU/mL', NOW(), NOW()),
        ($1, 'Isohemagglutinin', $12, '', NOW(), NOW())`,
      [
        patientId,
        data.totalLeukocyte || null,
        data.totalNeutrophil || null,
        data.totalLymphocyte || null,
        data.totalEosinophil || null,
        data.totalPlatelet || null,
        data.igG || null,
        data.igE || null,
        data.igM || null,
        data.igA || null,
        data.antiHBS || null,
        data.isohemagglutinin || null
      ]
    );

    await client.end();

    console.log('Lab results saved successfully');

    return NextResponse.json({ 
      success: true,
      message: 'Laboratuvar sonuçları kaydedildi'
    });
  } catch (error) {
    console.error('Lab results save error:', error);
    try {
      await client.end();
    } catch (e) {
      // ignore
    }
    return NextResponse.json(
      { 
        error: 'Laboratuvar sonuçları kaydedilemedi',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}

