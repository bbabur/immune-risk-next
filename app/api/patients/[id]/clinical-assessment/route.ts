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
    
    console.log('Saving clinical assessment for patient:', patientId);

    // Create or update clinical features
    const clinicalResult = await client.query(
      `INSERT INTO clinical_features (
        patient_id,
        growth_failure,
        chronic_skin_issue,
        chronic_diarrhea,
        bcg_lymphadenopathy,
        persistent_thrush,
        deep_abscesses,
        chd,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING id`,
      [
        patientId,
        data.failureToThrive === 'yes',
        data.chronicSkinIssue === 'yes',
        data.chronicDiarrhea === 'yes',
        data.bcgLymphadenopathy === 'yes',
        data.persistentThrush === 'yes',
        data.deepAbscesses === 'yes',
        data.chd === 'yes'
      ]
    );

    // Create family history
    await client.query(
      `INSERT INTO family_history (
        patient_id,
        family_iei_history,
        family_early_death,
        created_at
      ) VALUES ($1, $2, $3, NOW())`,
      [
        patientId,
        data.familyIeiHistory === 'yes',
        data.familyEarlyDeath === 'yes'
      ]
    );

    // Create infections
    await client.query(
      `INSERT INTO infections (
        patient_id,
        infection_type,
        infection_count,
        iv_antibiotics_required,
        created_at
      ) VALUES 
        ($1, 'otitis', $2, false, NOW()),
        ($1, 'sinusitis', $3, false, NOW()),
        ($1, 'pneumonia', $4, false, NOW()),
        ($1, 'deep_infection', $5, $6, NOW())`,
      [
        patientId,
        parseInt(data.otitisCount) || 0,
        parseInt(data.sinusitisCount) || 0,
        parseInt(data.pneumoniaCount) || 0,
        parseInt(data.deepInfectionsCount) || 0,
        data.ivAntibiotics === 'yes'
      ]
    );

    // Create hospitalizations
    if (data.hospitalization === 'yes' || data.icuAdmission === 'yes') {
      await client.query(
        `INSERT INTO hospitalizations (
          patient_id,
          admission_date,
          discharge_date,
          reason,
          icu_admission,
          created_at
        ) VALUES ($1, NOW(), NOW(), $2, $3, NOW())`,
        [
          patientId,
          'Klinik değerlendirme sırasında kaydedildi',
          data.icuAdmission === 'yes'
        ]
      );
    }

    // Update patient cord fall day if provided
    if (data.cordFallDay) {
      await client.query(
        `UPDATE patients SET cord_fall_day = $1, updated_at = NOW() WHERE id = $2`,
        [parseInt(data.cordFallDay), patientId]
      );
    }

    await client.end();

    console.log('Clinical assessment saved successfully');

    return NextResponse.json({ 
      success: true,
      message: 'Klinik değerlendirme kaydedildi'
    });
  } catch (error) {
    console.error('Clinical assessment save error:', error);
    try {
      await client.end();
    } catch (e) {
      // ignore
    }
    return NextResponse.json(
      { 
        error: 'Klinik değerlendirme kaydedilemedi',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}

