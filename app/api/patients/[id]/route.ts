import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    const { id } = await params;
    const patientId = parseInt(id);

    if (isNaN(patientId)) {
      await client.end();
      return NextResponse.json({ error: 'Geçersiz hasta ID' }, { status: 400 });
    }

    // Get patient basic info
    const patientResult = await client.query(
      `SELECT * FROM patients WHERE id = $1`,
      [patientId]
    );

    if (patientResult.rows.length === 0) {
      await client.end();
      return NextResponse.json({ error: 'Hasta bulunamadı' }, { status: 404 });
    }

    const patient = patientResult.rows[0];

    // Get related data (optional - if tables exist)
    let clinicalFeatures = [];
    let labResults = [];
    let riskAssessments = [];

    try {
      const cfResult = await client.query(
        `SELECT * FROM clinical_features WHERE patient_id = $1 ORDER BY created_at DESC`,
        [patientId]
      );
      clinicalFeatures = cfResult.rows;
    } catch (e) {
      console.log('Clinical features table not found or empty');
    }

    try {
      const lrResult = await client.query(
        `SELECT * FROM lab_results WHERE patient_id = $1 ORDER BY test_date DESC`,
        [patientId]
      );
      labResults = lrResult.rows;
    } catch (e) {
      console.log('Lab results table not found or empty');
    }

    try {
      const raResult = await client.query(
        `SELECT * FROM risk_assessments WHERE patient_id = $1 ORDER BY assessment_date DESC`,
        [patientId]
      );
      riskAssessments = raResult.rows;
    } catch (e) {
      console.log('Risk assessments table not found or empty');
    }

    await client.end();

    // Format response
    const formattedPatient = {
      ...patient,
      fileNumber: patient.file_number,
      ageYears: patient.age_years,
      ageMonths: patient.age_months,
      birthWeight: patient.birth_weight,
      gestationalAge: patient.gestational_age,
      cordFallDay: patient.cord_fall_day,
      parentalConsanguinity: patient.parental_consanguinity,
      hasImmuneDeficiency: patient.has_immune_deficiency,
      diagnosisType: patient.diagnosis_type,
      diagnosisDate: patient.diagnosis_date,
      ruleBasedScore: patient.rule_based_score,
      mlScore: patient.ml_score,
      finalRiskLevel: patient.final_risk_level,
      createdAt: patient.created_at,
      updatedAt: patient.updated_at,
      clinicalFeatures,
      labResults,
      riskAssessments
    };

    return NextResponse.json(formattedPatient);
  } catch (error) {
    console.error('Hasta bilgileri alınamadı:', error);
    try {
      await client.end();
    } catch (e) {
      // ignore
    }
    return NextResponse.json(
      { 
        error: 'Hasta bilgileri alınamadı',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}

// DELETE - Tek hasta silme (önyüzden izinli)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    const { id } = await params;
    const patientId = parseInt(id);

    if (isNaN(patientId)) {
      await client.end();
      return NextResponse.json({ error: 'Geçersiz hasta ID' }, { status: 400 });
    }

    // İlişkili verileri önce sil (foreign key constraint)
    await client.query('DELETE FROM clinical_features WHERE patient_id = $1', [patientId]);
    await client.query('DELETE FROM family_history WHERE patient_id = $1', [patientId]);
    await client.query('DELETE FROM infections WHERE patient_id = $1', [patientId]);
    await client.query('DELETE FROM hospitalizations WHERE patient_id = $1', [patientId]);
    await client.query('DELETE FROM lab_results WHERE patient_id = $1', [patientId]);
    await client.query('DELETE FROM treatments WHERE patient_id = $1', [patientId]);
    await client.query('DELETE FROM vaccinations WHERE patient_id = $1', [patientId]);
    await client.query('DELETE FROM risk_assessments WHERE patient_id = $1', [patientId]);
    await client.query('DELETE FROM notifications WHERE patient_id = $1', [patientId]);

    // Hastayı sil
    const result = await client.query('DELETE FROM patients WHERE id = $1 RETURNING id', [patientId]);
    
    await client.end();

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Hasta bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Hasta başarıyla silindi', id: patientId });
  } catch (error) {
    console.error('Hasta silinemedi:', error);
    try {
      await client.end();
    } catch (e) {
      // ignore
    }
    return NextResponse.json(
      { 
        error: 'Hasta silinemedi',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}
