// Excel'deki 11 hasta verisi ile ML API testi
const ML_API = 'https://immune-risk-ml-api.onrender.com/predict';

const patients = [
  { id:1, otit:5, sinuzit:4, ab:0, pnomoni:0, kilo:0, apse:0, mantar:0, iv_ab:0, derin:0, aile:0, cinsiyet:1, yas:30, hastane:0, bcg:0, cilt:0, gobek:14, kalp:0, ishal:0, yogun:0, akraba:0, erken_olum:0, expected:1 },
  { id:2, otit:5, sinuzit:4, ab:1, pnomoni:0, kilo:0, apse:0, mantar:0, iv_ab:0, derin:0, aile:0, cinsiyet:0, yas:35, hastane:0, bcg:0, cilt:0, gobek:14, kalp:0, ishal:0, yogun:0, akraba:0, erken_olum:0, expected:1 },
  { id:3, otit:4, sinuzit:4, ab:2, pnomoni:1, kilo:1, apse:3, mantar:1, iv_ab:1, derin:1, aile:1, cinsiyet:0, yas:40, hastane:1, bcg:0, cilt:0, gobek:14, kalp:0, ishal:0, yogun:0, akraba:1, erken_olum:0, expected:1 },
  { id:4, otit:4, sinuzit:4, ab:2, pnomoni:1, kilo:1, apse:3, mantar:1, iv_ab:1, derin:1, aile:1, cinsiyet:0, yas:40, hastane:1, bcg:0, cilt:0, gobek:14, kalp:0, ishal:0, yogun:0, akraba:1, erken_olum:0, expected:1 },
  { id:5, otit:1, sinuzit:1, ab:1, pnomoni:1, kilo:0, apse:1, mantar:1, iv_ab:1, derin:3, aile:1, cinsiyet:0, yas:52, hastane:0, bcg:0, cilt:0, gobek:14, kalp:0, ishal:0, yogun:0, akraba:0, erken_olum:0, expected:1 },
  { id:6, otit:1, sinuzit:3, ab:1, pnomoni:3, kilo:1, apse:0, mantar:0, iv_ab:0, derin:0, aile:1, cinsiyet:0, yas:25, hastane:1, bcg:0, cilt:0, gobek:5, kalp:0, ishal:1, yogun:0, akraba:1, erken_olum:0, expected:1 },
  { id:7, otit:6, sinuzit:6, ab:1, pnomoni:6, kilo:1, apse:1, mantar:0, iv_ab:0, derin:0, aile:0, cinsiyet:0, yas:12, hastane:1, bcg:0, cilt:0, gobek:10, kalp:0, ishal:0, yogun:0, akraba:0, erken_olum:0, expected:1 },
  { id:8, otit:1, sinuzit:1, ab:0, pnomoni:0, kilo:0, apse:0, mantar:0, iv_ab:0, derin:0, aile:0, cinsiyet:0, yas:35, hastane:0, bcg:0, cilt:0, gobek:14, kalp:0, ishal:0, yogun:0, akraba:0, erken_olum:0, expected:0 },
  { id:9, otit:1, sinuzit:3, ab:1, pnomoni:3, kilo:1, apse:0, mantar:0, iv_ab:0, derin:0, aile:0, cinsiyet:1, yas:70, hastane:0, bcg:0, cilt:0, gobek:10, kalp:0, ishal:0, yogun:0, akraba:0, erken_olum:0, expected:1 },
  { id:10, otit:0, sinuzit:0, ab:0, pnomoni:0, kilo:1, apse:1, mantar:1, iv_ab:1, derin:0, aile:0, cinsiyet:1, yas:80, hastane:1, bcg:0, cilt:0, gobek:12, kalp:0, ishal:0, yogun:0, akraba:1, erken_olum:0, expected:1 },
  { id:11, otit:1, sinuzit:1, ab:1, pnomoni:1, kilo:1, apse:0, mantar:0, iv_ab:0, derin:0, aile:0, cinsiyet:1, yas:12, hastane:0, bcg:0, cilt:1, gobek:12, kalp:0, ishal:0, yogun:0, akraba:1, erken_olum:0, expected:1 },
];

async function test() {
  console.log('ML API Test - 11 Hasta');
  console.log('='.repeat(60));

  let correct = 0;
  const results = [];

  for (const p of patients) {
    const body = {
      otit_sayisi_ge_4:    p.otit,
      sinuzit_sayisi_ge_2: p.sinuzit,
      iki_aydan_fazla_ab:  p.ab,
      pnomoni_ge_2:        p.pnomoni,
      kilo_alamama:        p.kilo,
      tekrarlayan_apse:    p.apse,
      pamukcuk_mantar:     p.mantar,
      iv_antibiyotik:      p.iv_ab,
      derin_enf_ge_2:      p.derin,
      aile_oykusu_boy:     p.aile,
      cinsiyet:            p.cinsiyet,
      yas:                 p.yas,
      hastane_yatis:       p.hastane,
      bcg_lenfadenopati:   p.bcg,
      kronik_cilt:         p.cilt,
      gobek_kordon_gunu:   p.gobek,
      konjenital_kalp:     p.kalp,
      kronik_ishal:        p.ishal,
      yogun_bakim:         p.yogun,
      akrabalik:           p.akraba,
      aile_erken_olum:     p.erken_olum,
    };

    try {
      const res = await fetch(ML_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const match = data.prediction === p.expected;
      if (match) correct++;
      
      const status = match ? '✅' : '❌';
      console.log(`${status} Hasta ${p.id}: Beklenen=${p.expected} | Tahmin=${data.prediction} | Prob=${data.probability?.toFixed(3)} | Risk=${data.risk_level}`);
      results.push({ id: p.id, expected: p.expected, prediction: data.prediction, prob: data.probability, match });
    } catch (e) {
      console.log(`❗ Hasta ${p.id}: HATA - ${e.message}`);
    }
  }

  console.log('='.repeat(60));
  console.log(`Doğru: ${correct}/11`);
  console.log('\nYanlış tahmin edilenler:');
  results.filter(r => !r.match).forEach(r => {
    console.log(`  Hasta ${r.id}: Beklenen=${r.expected}, Tahmin=${r.prediction}, Prob=${r.prob?.toFixed(3)}`);
  });
}

test();
