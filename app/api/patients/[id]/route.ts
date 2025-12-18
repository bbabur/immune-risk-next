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

// PATCH - Hasta bilgilerini güncelle
export async function PATCH(
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

    const body = await request.json();
    
    // Güncellenebilir alanlar
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (body.height !== undefined && body.height !== '') {
      updates.push(`height = $${paramIndex++}`);
      values.push(body.height);
    }
    if (body.weight !== undefined && body.weight !== '') {
      updates.push(`weight = $${paramIndex++}`);
      values.push(body.weight);
    }
    if (body.ethnicity !== undefined) {
      updates.push(`ethnicity = $${paramIndex++}`);
      values.push(body.ethnicity);
    }
    if (body.parentalConsanguinity !== undefined) {
      updates.push(`parental_consanguinity = $${paramIndex++}`);
      values.push(body.parentalConsanguinity);
    }
    if (body.birthWeight !== undefined && body.birthWeight !== '') {
      updates.push(`birth_weight = $${paramIndex++}`);
      values.push(body.birthWeight);
    }
    if (body.gestationalAge !== undefined && body.gestationalAge !== '') {
      updates.push(`gestational_age = $${paramIndex++}`);
      values.push(body.gestationalAge);
    }
    if (body.cordFallDay !== undefined && body.cordFallDay !== '') {
      updates.push(`cord_fall_day = $${paramIndex++}`);
      values.push(body.cordFallDay);
    }
    if (body.birthType !== undefined) {
      updates.push(`birth_type = $${paramIndex++}`);
      values.push(body.birthType);
    }
    if (body.breastfeedingMonths !== undefined && body.breastfeedingMonths !== '') {
      updates.push(`breastfeeding_months = $${paramIndex++}`);
      values.push(body.breastfeedingMonths);
    }

    if (updates.length === 0) {
      await client.end();
      return NextResponse.json({ error: 'Güncellenecek alan bulunamadı' }, { status: 400 });
    }

    // updated_at alanını da güncelle
    updates.push(`updated_at = NOW()`);
    values.push(patientId);

    const query = `
      UPDATE patients 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await client.query(query, values);
    await client.end();

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Hasta bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Hasta bilgileri başarıyla güncellendi',
      patient: result.rows[0]
    });
  } catch (error) {
    console.error('Hasta güncellenemedi:', error);
    try {
      await client.end();
    } catch (e) {
      // ignore
    }
    return NextResponse.json(
      { 
        error: 'Hasta güncellenemedi',
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
