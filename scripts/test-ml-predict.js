/**
 * ML Predict API Test Script
 * JSON formatı ile örnek istekleri gönderir ve sonuçları karşılaştırır
 * 
 * Kullanım:
 *   node scripts/test-ml-predict.js
 *   ML_SERVICE_URL=http://localhost:8000 node scripts/test-ml-predict.js  (lokal)
 */

const ML_URL = process.env.ML_SERVICE_URL || 'https://immune-risk-ml-api.onrender.com';

// Excel JSON formatında örnek istekler (Deneme Yapay Zeka ile aynı)
const EXAMPLE_REQUESTS = [
  {
    name: 'Hasta 1',
    expected: '1 (HASTA OLABİLİR)',
    yzSonucu: 0,
    data: {
      "1 Yıl İçinde Otit Sayısı ≥4": 5,
      "1 Yıl İçinde Sinüzit Sayısı ≥2": 4,
      "2 Aydan Fazla Oral Antibiyotik Kullanımı": 0,
      "1 yıl içinde ≥2 pnomoni": 0,
      "Bir Bebeğin Kilo Alamaması veya Normal Büyümemesi": 0,
      "Tekrarlayan, Derin Cilt veya Organ Apseleri": 0,
      "Ağızda veya Deride Kalıcı Pamukçuk yada Mantar Enfeksiyonu": 0,
      "İntravenöz Antibiyotik Gerektiren Enfeksiyonlar": 0,
      "Septisemi Dâhil ≥2 Derin Enfeksiyon": 0,
      "Ailede Doğuştan İmmün Yetmezlik Öyküsü": 0,
      "CİNSİYET": 1,
      "YAŞ": 30,
      "Hastaneye Yatış Varlığı": 0,
      "BCG Aşısı Sonrası Lenfadenopati": 0,
      "Kronik Cilt (deri) Problemleri": 0,
      "Göbek Kordonunun Düşme Günü": 14,
      "Konjenital Kalp Hastalığı": 0,
      "Kronik İshal": 0,
      "Yoğun Bakımda Yatış": 0,
      "Anne-Baba Arasında Akrabalık Varlığı": 0,
      "Ailede Erken Ölüm Öyküsü": 0
    }
  },
  {
    name: 'Hasta 2',
    expected: 1,
    yzSonucu: 0,
    data: {
      "1 Yıl İçinde Otit Sayısı ≥4": 5,
      "1 Yıl İçinde Sinüzit Sayısı ≥2": 4,
      "2 Aydan Fazla Oral Antibiyotik Kullanımı": 1,
      "1 yıl içinde ≥2 pnomoni": 0,
      "Bir Bebeğin Kilo Alamaması veya Normal Büyümemesi": 0,
      "Tekrarlayan, Derin Cilt veya Organ Apseleri": 0,
      "Ağızda veya Deride Kalıcı Pamukçuk yada Mantar Enfeksiyonu": 0,
      "İntravenöz Antibiyotik Gerektiren Enfeksiyonlar": 0,
      "Septisemi Dâhil ≥2 Derin Enfeksiyon": 0,
      "Ailede Doğuştan İmmün Yetmezlik Öyküsü": 0,
      "CİNSİYET": 0,
      "YAŞ": 35,
      "Hastaneye Yatış Varlığı": 0,
      "BCG Aşısı Sonrası Lenfadenopati": 0,
      "Kronik Cilt (deri) Problemleri": 0,
      "Göbek Kordonunun Düşme Günü": 14,
      "Konjenital Kalp Hastalığı": 0,
      "Kronik İshal": 0,
      "Yoğun Bakımda Yatış": 0,
      "Anne-Baba Arasında Akrabalık Varlığı": 0,
      "Ailede Erken Ölüm Öyküsü": 0
    }
  },
  {
    name: 'Hasta 8',
    expected: 0,
    yzSonucu: 0,
    data: {
      "1 Yıl İçinde Otit Sayısı ≥4": 1,
      "1 Yıl İçinde Sinüzit Sayısı ≥2": 1,
      "2 Aydan Fazla Oral Antibiyotik Kullanımı": 0,
      "1 yıl içinde ≥2 pnomoni": 0,
      "Bir Bebeğin Kilo Alamaması veya Normal Büyümemesi": 0,
      "Tekrarlayan, Derin Cilt veya Organ Apseleri": 0,
      "Ağızda veya Deride Kalıcı Pamukçuk yada Mantar Enfeksiyonu": 0,
      "İntravenöz Antibiyotik Gerektiren Enfeksiyonlar": 0,
      "Septisemi Dâhil ≥2 Derin Enfeksiyon": 0,
      "Ailede Doğuştan İmmün Yetmezlik Öyküsü": 0,
      "CİNSİYET": 0,
      "YAŞ": 35,
      "Hastaneye Yatış Varlığı": 0,
      "BCG Aşısı Sonrası Lenfadenopati": 0,
      "Kronik Cilt (deri) Problemleri": 0,
      "Göbek Kordonunun Düşme Günü": 14,
      "Konjenital Kalp Hastalığı": 0,
      "Kronik İshal": 0,
      "Yoğun Bakımda Yatış": 0,
      "Anne-Baba Arasında Akrabalık Varlığı": 0,
      "Ailede Erken Ölüm Öyküsü": 0
    }
  }
];

async function testPredict(data) {
  const res = await fetch(`${ML_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function main() {
  console.log('='.repeat(60));
  console.log('ML Predict API Test - JSON Format (Deneme Yapay Zeka ile aynı)');
  console.log('API URL:', ML_URL);
  console.log('='.repeat(60));

  // Health check
  try {
    const health = await fetch(`${ML_URL}/health`).then(r => r.json());
    console.log('\n✓ ML API erişilebilir:', health.status);
    if (health.model_loaded) {
      console.log('  Model yüklü:', health.model_loaded);
    }
  } catch (e) {
    console.error('\n✗ ML API\'ye bağlanılamadı:', e.message);
    console.log('\nLokal test için: cd immune-risk-ml-api && uvicorn main:app --port 8000');
    console.log('Sonra: ML_SERVICE_URL=http://localhost:8000 node scripts/test-ml-predict.js');
    process.exit(1);
  }

  console.log('\n--- Örnek İstekler (Excel JSON formatı) ---\n');

  for (const req of EXAMPLE_REQUESTS) {
    try {
      const result = await testPredict(req.data);
      const expectedPred = typeof req.expected === 'number' ? req.expected : 1;
      const match = result.prediction === req.yzSonucu ? '✓' : '✗';
      
      console.log(`${req.name}:`);
      console.log(`  Gönderilen: CİNSİYET=${req.data.CİNSİYET}, YAŞ=${req.data.YAŞ}, Otit=${req.data["1 Yıl İçinde Otit Sayısı ≥4"]}`);
      console.log(`  API Yanıtı: prediction=${result.prediction}, probability=${result.probability?.toFixed(3)}, risk_level=${result.risk_level}`);
      console.log(`  Excel YZ SONUCU: ${req.yzSonucu}`);
      console.log(`  Eşleşme: ${match} (API: ${result.prediction} vs Excel: ${req.yzSonucu})`);
      console.log('');
    } catch (e) {
      console.error(`${req.name}: HATA -`, e.message);
      console.log('');
    }
  }

  console.log('='.repeat(60));
  console.log('Test tamamlandı.');
}

main().catch(console.error);
