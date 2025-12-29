import { NextRequest, NextResponse } from 'next/server';

// ML servisi URL'i - environment variable'dan alınır
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// İstek tipi tanımı
interface PredictRequest {
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

// Yanıt tipi tanımı
interface PredictResponse {
  prediction: number;
  probability: number | null;
  risk_level: string;
  message: string;
}

/**
 * ML servisi sağlık kontrolü
 */
export async function GET() {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'ML servisi yanıt vermiyor',
          ml_service_url: ML_SERVICE_URL 
        },
        { status: 503 }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      status: 'ok',
      ml_service: data,
      ml_service_url: ML_SERVICE_URL
    });
  } catch (error) {
    console.error('ML servis sağlık kontrolü hatası:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'ML servisine bağlanılamadı',
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        ml_service_url: ML_SERVICE_URL
      },
      { status: 503 }
    );
  }
}

/**
 * ML modeli ile tahmin yap
 */
export async function POST(request: NextRequest) {
  try {
    const body: PredictRequest = await request.json();
    
    // Varsayılan değerler ile birleştir
    const features: PredictRequest = {
      otit_sayisi_ge_4: body.otit_sayisi_ge_4 ?? 0,
      sinuzit_sayisi_ge_2: body.sinuzit_sayisi_ge_2 ?? 0,
      iki_aydan_fazla_ab: body.iki_aydan_fazla_ab ?? 0,
      pnomoni_ge_2: body.pnomoni_ge_2 ?? 0,
      kilo_alamama: body.kilo_alamama ?? 0,
      tekrarlayan_apse: body.tekrarlayan_apse ?? 0,
      pamukcuk_mantar: body.pamukcuk_mantar ?? 0,
      iv_antibiyotik: body.iv_antibiyotik ?? 0,
      derin_enf_ge_2: body.derin_enf_ge_2 ?? 0,
      aile_oykusu_boy: body.aile_oykusu_boy ?? 0,
      cinsiyet: body.cinsiyet ?? 0,
      yas: body.yas ?? 0,
      hastane_yatis: body.hastane_yatis ?? 0,
      bcg_lenfadenopati: body.bcg_lenfadenopati ?? 0,
      kronik_cilt: body.kronik_cilt ?? 0,
      gobek_kordon_gunu: body.gobek_kordon_gunu ?? 7,
      konjenital_kalp: body.konjenital_kalp ?? 0,
      kronik_ishal: body.kronik_ishal ?? 0,
      yogun_bakim: body.yogun_bakim ?? 0,
      akrabalik: body.akrabalik ?? 0,
      aile_erken_olum: body.aile_erken_olum ?? 0,
    };

    console.log('ML servisine istek gönderiliyor:', ML_SERVICE_URL);
    console.log('Özellikler:', features);

    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(features),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('ML servisi hata yanıtı:', errorData);
      return NextResponse.json(
        { 
          error: 'ML servisi tahmin yapamadı',
          details: errorData,
          status: response.status
        },
        { status: response.status }
      );
    }

    const prediction: PredictResponse = await response.json();
    console.log('ML servisi yanıtı:', prediction);

    return NextResponse.json({
      success: true,
      ...prediction
    });
  } catch (error) {
    console.error('ML tahmin hatası:', error);
    return NextResponse.json(
      { 
        error: 'ML servisi ile iletişim kurulamadı',
        message: error instanceof Error ? error.message : 'Bilinmeyen hata',
        ml_service_url: ML_SERVICE_URL
      },
      { status: 500 }
    );
  }
}

