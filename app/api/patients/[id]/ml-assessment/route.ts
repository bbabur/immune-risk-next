import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

// ML servisi URL'i - Production'da Render URL'i kullan
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'https://immune-risk-ml-api.onrender.com';

interface MLFeatures {
  otit_sayisi_ge_4: number;
  sinuzit_sayisi_ge_2: number;
  iki_aydan_fazla_ab: number;
  pnomoni_ge_2: number;
  kilo_alamama: number;
  tekrarlayan_apse: number;
  pamukcuk_mantar: number;
  iv_antibiyotik: number;
  derin_enf_ge_2: number;
  aile_oykusu_boy: number;
  cinsiyet: number;
  yas: number;
  hastane_yatis: number;
  bcg_lenfadenopati: number;
  kronik_cilt: number;
  gobek_kordon_gunu: number;
  konjenital_kalp: number;
  kronik_ishal: number;
  yogun_bakim: number;
  akrabalik: number;
  aile_erken_olum: number;
}

// GET - Son ML değerlendirmesini getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const patientId = parseInt(params.id);
    
    const result = await client.query(
      `SELECT * FROM risk_assessments 
       WHERE patient_id = $1 AND ml_prediction IS NOT NULL
       ORDER BY assessment_date DESC 
       LIMIT 1`,
      [patientId]
    );

    await client.end();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'ML değerlendirmesi bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('ML assessment fetch error:', error);
    try { await client.end(); } catch (e) { /* ignore */ }
    return NextResponse.json(
      { error: 'ML değerlendirmesi alınamadı' },
      { status: 500 }
    );
  }
}

// POST - ML değerlendirmesi yap ve kaydet
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const body = await request.json();
    const raw = body.features || {};
    const patientId = parseInt(params.id);

    console.log('[ML API Request] Frontend\'den gelen ham veri:', JSON.stringify(raw));

    // Tüm değerleri sayıya çevir - undefined/NaN için 0
    const toNum = (v: unknown) => {
      const n = Number(v);
      return isNaN(n) ? 0 : n;
    };

    // Cinsiyet: string (male/female/erkek/kadın) veya sayı (0/1) kabul et
    const parseCinsiyet = (v: unknown): number => {
      const n = Number(v);
      if (!isNaN(n) && (n === 0 || n === 1)) return n;
      const s = String(v ?? '').toLowerCase().trim();
      if (['1', 'female', 'kadın', 'kız', 'kadin', 'f', 'k'].includes(s)) return 1;
      return 0; // male, erkek, 0, bilinmiyor
    };

    const features: MLFeatures = {
      otit_sayisi_ge_4: toNum(raw.otit_sayisi_ge_4),
      sinuzit_sayisi_ge_2: toNum(raw.sinuzit_sayisi_ge_2),
      iki_aydan_fazla_ab: toNum(raw.iki_aydan_fazla_ab),
      pnomoni_ge_2: toNum(raw.pnomoni_ge_2),
      kilo_alamama: toNum(raw.kilo_alamama),
      tekrarlayan_apse: toNum(raw.tekrarlayan_apse),
      pamukcuk_mantar: toNum(raw.pamukcuk_mantar),
      iv_antibiyotik: toNum(raw.iv_antibiyotik),
      derin_enf_ge_2: toNum(raw.derin_enf_ge_2),
      aile_oykusu_boy: toNum(raw.aile_oykusu_boy),
      cinsiyet: parseCinsiyet(raw.cinsiyet),
      yas: toNum(raw.yas),
      hastane_yatis: toNum(raw.hastane_yatis),
      bcg_lenfadenopati: toNum(raw.bcg_lenfadenopati),
      kronik_cilt: toNum(raw.kronik_cilt),
      gobek_kordon_gunu: toNum(raw.gobek_kordon_gunu) || 7,
      konjenital_kalp: toNum(raw.konjenital_kalp),
      kronik_ishal: toNum(raw.kronik_ishal),
      yogun_bakim: toNum(raw.yogun_bakim),
      akrabalik: toNum(raw.akrabalik),
      aile_erken_olum: toNum(raw.aile_erken_olum),
    };

    const requestBody = JSON.stringify(features);
    console.log('[ML API Request] Hasta ID:', patientId);
    console.log('[ML API Request] ML servisine gönderilen JSON (kopyala-yapıştır için):');
    console.log(requestBody);

    // ML servisine istek at
    let mlResult;
    try {
      const mlResponse = await fetch(`${ML_SERVICE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(features),
      });

      if (!mlResponse.ok) {
        throw new Error(`ML servisi yanıt vermedi: ${mlResponse.status}`);
      }

      mlResult = await mlResponse.json();
      console.log('ML servisi yanıtı:', mlResult);
    } catch (mlError) {
      console.error('ML servisi hatası:', mlError);
      return NextResponse.json(
        { 
          error: 'ML servisine bağlanılamadı',
          details: mlError instanceof Error ? mlError.message : 'Bilinmeyen hata',
          ml_service_url: ML_SERVICE_URL
        },
        { status: 503 }
      );
    }

    // Veritabanına kaydet
    await client.connect();

    // Öneri oluştur
    let recommendation = '';
    if (mlResult.prediction === 1) {
      if (mlResult.risk_level?.includes('Çok Yüksek')) {
        recommendation = 'Acil pediatrik immünoloji konsültasyonu gereklidir. Kapsamlı immünolojik değerlendirme ve genetik testler planlanmalıdır.';
      } else if (mlResult.risk_level?.includes('Yüksek')) {
        recommendation = 'Pediatrik immünoloji konsültasyonu önerilir. İmmünoglobulin düzeyleri ve lenfosit alt grupları değerlendirilmelidir.';
      } else {
        recommendation = 'Takip ve ek testler önerilir. 6 ay içinde tekrar değerlendirme yapılmalıdır.';
      }
    } else {
      recommendation = 'Rutin pediatrik takip önerilir. Şüpheli bulgular gelişirse tekrar değerlendirme yapılabilir.';
    }

    // Risk assessment kaydı oluştur
    const result = await client.query(
      `INSERT INTO risk_assessments (
        patient_id,
        assessment_date,
        risk_level,
        recommendation,
        model_version,
        model_confidence,
        ml_prediction,
        ml_probability,
        ml_risk_level,
        ml_features
      ) VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        patientId,
        mlResult.risk_level,
        recommendation,
        '1.0.0',
        mlResult.probability,
        mlResult.prediction,
        mlResult.probability,
        mlResult.risk_level,
        JSON.stringify(features)
      ]
    );

    // Patient tablosunu güncelle - ML sonucuna göre tanı bilgisini de güncelle
    const hasImmuneDeficiency = mlResult.prediction === 1;
    const diagnosisType = hasImmuneDeficiency ? 'ML Değerlendirmesi - Risk Tespit Edildi' : 'ML Değerlendirmesi - Risk Tespit Edilmedi';
    const diagnosisDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    await client.query(
      `UPDATE patients 
       SET ml_score = $1, 
           final_risk_level = $2, 
           has_immune_deficiency = $3,
           diagnosis_type = $4,
           diagnosis_date = $5,
           updated_at = NOW()
       WHERE id = $6`,
      [mlResult.probability, mlResult.risk_level, hasImmuneDeficiency, diagnosisType, diagnosisDate, patientId]
    );

    await client.end();

    console.log('ML değerlendirmesi kaydedildi:', result.rows[0].id);

    return NextResponse.json({
      success: true,
      assessment: result.rows[0],
      prediction: mlResult.prediction,
      probability: mlResult.probability,
      risk_level: mlResult.risk_level,
      message: mlResult.message,
      recommendation
    });

  } catch (error) {
    console.error('ML assessment error:', error);
    try { await client.end(); } catch (e) { /* ignore */ }
    return NextResponse.json(
      { 
        error: 'ML değerlendirmesi yapılamadı',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}

