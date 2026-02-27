/**
 * Tüm 11 hastayı ML API'ye gönderir, YZ SONUCU ile karşılaştırır
 * node scripts/test-all-patients.js
 */

const ML_URL = process.env.ML_SERVICE_URL || 'https://immune-risk-ml-api.onrender.com';

const PATIENTS = [
  { no: 1, yzSonucu: 0, data: { "1 Yıl İçinde Otit Sayısı ≥4": 5, "1 Yıl İçinde Sinüzit Sayısı ≥2": 4, "2 Aydan Fazla Oral Antibiyotik Kullanımı": 0, "1 yıl içinde ≥2 pnomoni": 0, "Bir Bebeğin Kilo Alamaması veya Normal Büyümemesi": 0, "Tekrarlayan, Derin Cilt veya Organ Apseleri": 0, "Ağızda veya Deride Kalıcı Pamukçuk yada Mantar Enfeksiyonu": 0, "İntravenöz Antibiyotik Gerektiren Enfeksiyonlar": 0, "Septisemi Dâhil ≥2 Derin Enfeksiyon": 0, "Ailede Doğuştan İmmün Yetmezlik Öyküsü": 0, "CİNSİYET": 1, "YAŞ": 30, "Hastaneye Yatış Varlığı": 0, "BCG Aşısı Sonrası Lenfadenopati": 0, "Kronik Cilt (deri) Problemleri": 0, "Göbek Kordonunun Düşme Günü": 14, "Konjenital Kalp Hastalığı": 0, "Kronik İshal": 0, "Yoğun Bakımda Yatış": 0, "Anne-Baba Arasında Akrabalık Varlığı": 0, "Ailede Erken Ölüm Öyküsü": 0 }},
  { no: 2, yzSonucu: 0, data: { "1 Yıl İçinde Otit Sayısı ≥4": 5, "1 Yıl İçinde Sinüzit Sayısı ≥2": 4, "2 Aydan Fazla Oral Antibiyotik Kullanımı": 1, "1 yıl içinde ≥2 pnomoni": 0, "Bir Bebeğin Kilo Alamaması veya Normal Büyümemesi": 0, "Tekrarlayan, Derin Cilt veya Organ Apseleri": 0, "Ağızda veya Deride Kalıcı Pamukçuk yada Mantar Enfeksiyonu": 0, "İntravenöz Antibiyotik Gerektiren Enfeksiyonlar": 0, "Septisemi Dâhil ≥2 Derin Enfeksiyon": 0, "Ailede Doğuştan İmmün Yetmezlik Öyküsü": 0, "CİNSİYET": 0, "YAŞ": 35, "Hastaneye Yatış Varlığı": 0, "BCG Aşısı Sonrası Lenfadenopati": 0, "Kronik Cilt (deri) Problemleri": 0, "Göbek Kordonunun Düşme Günü": 14, "Konjenital Kalp Hastalığı": 0, "Kronik İshal": 0, "Yoğun Bakımda Yatış": 0, "Anne-Baba Arasında Akrabalık Varlığı": 0, "Ailede Erken Ölüm Öyküsü": 0 }},
  { no: 3, yzSonucu: 1, data: { "1 Yıl İçinde Otit Sayısı ≥4": 4, "1 Yıl İçinde Sinüzit Sayısı ≥2": 4, "2 Aydan Fazla Oral Antibiyotik Kullanımı": 2, "1 yıl içinde ≥2 pnomoni": 1, "Bir Bebeğin Kilo Alamaması veya Normal Büyümemesi": 1, "Tekrarlayan, Derin Cilt veya Organ Apseleri": 3, "Ağızda veya Deride Kalıcı Pamukçuk yada Mantar Enfeksiyonu": 1, "İntravenöz Antibiyotik Gerektiren Enfeksiyonlar": 1, "Septisemi Dâhil ≥2 Derin Enfeksiyon": 1, "Ailede Doğuştan İmmün Yetmezlik Öyküsü": 1, "CİNSİYET": 0, "YAŞ": 40, "Hastaneye Yatış Varlığı": 1, "BCG Aşısı Sonrası Lenfadenopati": 0, "Kronik Cilt (deri) Problemleri": 0, "Göbek Kordonunun Düşme Günü": 14, "Konjenital Kalp Hastalığı": 0, "Kronik İshal": 0, "Yoğun Bakımda Yatış": 0, "Anne-Baba Arasında Akrabalık Varlığı": 1, "Ailede Erken Ölüm Öyküsü": 0 }},
  { no: 4, yzSonucu: 1, data: { "1 Yıl İçinde Otit Sayısı ≥4": 4, "1 Yıl İçinde Sinüzit Sayısı ≥2": 4, "2 Aydan Fazla Oral Antibiyotik Kullanımı": 2, "1 yıl içinde ≥2 pnomoni": 1, "Bir Bebeğin Kilo Alamaması veya Normal Büyümemesi": 1, "Tekrarlayan, Derin Cilt veya Organ Apseleri": 3, "Ağızda veya Deride Kalıcı Pamukçuk yada Mantar Enfeksiyonu": 1, "İntravenöz Antibiyotik Gerektiren Enfeksiyonlar": 1, "Septisemi Dâhil ≥2 Derin Enfeksiyon": 1, "Ailede Doğuştan İmmün Yetmezlik Öyküsü": 1, "CİNSİYET": 0, "YAŞ": 40, "Hastaneye Yatış Varlığı": 1, "BCG Aşısı Sonrası Lenfadenopati": 0, "Kronik Cilt (deri) Problemleri": 0, "Göbek Kordonunun Düşme Günü": 14, "Konjenital Kalp Hastalığı": 0, "Kronik İshal": 0, "Yoğun Bakımda Yatış": 0, "Anne-Baba Arasında Akrabalık Varlığı": 1, "Ailede Erken Ölüm Öyküsü": 0 }},
  { no: 5, yzSonucu: 1, data: { "1 Yıl İçinde Otit Sayısı ≥4": 1, "1 Yıl İçinde Sinüzit Sayısı ≥2": 1, "2 Aydan Fazla Oral Antibiyotik Kullanımı": 1, "1 yıl içinde ≥2 pnomoni": 1, "Bir Bebeğin Kilo Alamaması veya Normal Büyümemesi": 0, "Tekrarlayan, Derin Cilt veya Organ Apseleri": 1, "Ağızda veya Deride Kalıcı Pamukçuk yada Mantar Enfeksiyonu": 1, "İntravenöz Antibiyotik Gerektiren Enfeksiyonlar": 1, "Septisemi Dâhil ≥2 Derin Enfeksiyon": 3, "Ailede Doğuştan İmmün Yetmezlik Öyküsü": 1, "CİNSİYET": 0, "YAŞ": 52, "Hastaneye Yatış Varlığı": 0, "BCG Aşısı Sonrası Lenfadenopati": 0, "Kronik Cilt (deri) Problemleri": 0, "Göbek Kordonunun Düşme Günü": 14, "Konjenital Kalp Hastalığı": 0, "Kronik İshal": 0, "Yoğun Bakımda Yatış": 0, "Anne-Baba Arasında Akrabalık Varlığı": 0, "Ailede Erken Ölüm Öyküsü": 0 }},
  { no: 6, yzSonucu: 1, data: { "1 Yıl İçinde Otit Sayısı ≥4": 1, "1 Yıl İçinde Sinüzit Sayısı ≥2": 3, "2 Aydan Fazla Oral Antibiyotik Kullanımı": 1, "1 yıl içinde ≥2 pnomoni": 3, "Bir Bebeğin Kilo Alamaması veya Normal Büyümemesi": 1, "Tekrarlayan, Derin Cilt veya Organ Apseleri": 0, "Ağızda veya Deride Kalıcı Pamukçuk yada Mantar Enfeksiyonu": 0, "İntravenöz Antibiyotik Gerektiren Enfeksiyonlar": 0, "Septisemi Dâhil ≥2 Derin Enfeksiyon": 0, "Ailede Doğuştan İmmün Yetmezlik Öyküsü": 1, "CİNSİYET": 0, "YAŞ": 25, "Hastaneye Yatış Varlığı": 1, "BCG Aşısı Sonrası Lenfadenopati": 0, "Kronik Cilt (deri) Problemleri": 0, "Göbek Kordonunun Düşme Günü": 5, "Konjenital Kalp Hastalığı": 0, "Kronik İshal": 1, "Yoğun Bakımda Yatış": 0, "Anne-Baba Arasında Akrabalık Varlığı": 1, "Ailede Erken Ölüm Öyküsü": 0 }},
  { no: 7, yzSonucu: 1, data: { "1 Yıl İçinde Otit Sayısı ≥4": 6, "1 Yıl İçinde Sinüzit Sayısı ≥2": 6, "2 Aydan Fazla Oral Antibiyotik Kullanımı": 1, "1 yıl içinde ≥2 pnomoni": 6, "Bir Bebeğin Kilo Alamaması veya Normal Büyümemesi": 1, "Tekrarlayan, Derin Cilt veya Organ Apseleri": 1, "Ağızda veya Deride Kalıcı Pamukçuk yada Mantar Enfeksiyonu": 0, "İntravenöz Antibiyotik Gerektiren Enfeksiyonlar": 0, "Septisemi Dâhil ≥2 Derin Enfeksiyon": 0, "Ailede Doğuştan İmmün Yetmezlik Öyküsü": 0, "CİNSİYET": 0, "YAŞ": 12, "Hastaneye Yatış Varlığı": 1, "BCG Aşısı Sonrası Lenfadenopati": 0, "Kronik Cilt (deri) Problemleri": 0, "Göbek Kordonunun Düşme Günü": 10, "Konjenital Kalp Hastalığı": 0, "Kronik İshal": 0, "Yoğun Bakımda Yatış": 0, "Anne-Baba Arasında Akrabalık Varlığı": 0, "Ailede Erken Ölüm Öyküsü": 0 }},
  { no: 8, yzSonucu: 0, data: { "1 Yıl İçinde Otit Sayısı ≥4": 1, "1 Yıl İçinde Sinüzit Sayısı ≥2": 1, "2 Aydan Fazla Oral Antibiyotik Kullanımı": 0, "1 yıl içinde ≥2 pnomoni": 0, "Bir Bebeğin Kilo Alamaması veya Normal Büyümemesi": 0, "Tekrarlayan, Derin Cilt veya Organ Apseleri": 0, "Ağızda veya Deride Kalıcı Pamukçuk yada Mantar Enfeksiyonu": 0, "İntravenöz Antibiyotik Gerektiren Enfeksiyonlar": 0, "Septisemi Dâhil ≥2 Derin Enfeksiyon": 0, "Ailede Doğuştan İmmün Yetmezlik Öyküsü": 0, "CİNSİYET": 0, "YAŞ": 35, "Hastaneye Yatış Varlığı": 0, "BCG Aşısı Sonrası Lenfadenopati": 0, "Kronik Cilt (deri) Problemleri": 0, "Göbek Kordonunun Düşme Günü": 14, "Konjenital Kalp Hastalığı": 0, "Kronik İshal": 0, "Yoğun Bakımda Yatış": 0, "Anne-Baba Arasında Akrabalık Varlığı": 0, "Ailede Erken Ölüm Öyküsü": 0 }},
  { no: 9, yzSonucu: 1, data: { "1 Yıl İçinde Otit Sayısı ≥4": 1, "1 Yıl İçinde Sinüzit Sayısı ≥2": 3, "2 Aydan Fazla Oral Antibiyotik Kullanımı": 1, "1 yıl içinde ≥2 pnomoni": 3, "Bir Bebeğin Kilo Alamaması veya Normal Büyümemesi": 1, "Tekrarlayan, Derin Cilt veya Organ Apseleri": 0, "Ağızda veya Deride Kalıcı Pamukçuk yada Mantar Enfeksiyonu": 0, "İntravenöz Antibiyotik Gerektiren Enfeksiyonlar": 0, "Septisemi Dâhil ≥2 Derin Enfeksiyon": 0, "Ailede Doğuştan İmmün Yetmezlik Öyküsü": 0, "CİNSİYET": 1, "YAŞ": 70, "Hastaneye Yatış Varlığı": 0, "BCG Aşısı Sonrası Lenfadenopati": 0, "Kronik Cilt (deri) Problemleri": 0, "Göbek Kordonunun Düşme Günü": 10, "Konjenital Kalp Hastalığı": 0, "Kronik İshal": 0, "Yoğun Bakımda Yatış": 0, "Anne-Baba Arasında Akrabalık Varlığı": 0, "Ailede Erken Ölüm Öyküsü": 0 }},
  { no: 10, yzSonucu: 0, data: { "1 Yıl İçinde Otit Sayısı ≥4": 0, "1 Yıl İçinde Sinüzit Sayısı ≥2": 0, "2 Aydan Fazla Oral Antibiyotik Kullanımı": 0, "1 yıl içinde ≥2 pnomoni": 0, "Bir Bebeğin Kilo Alamaması veya Normal Büyümemesi": 1, "Tekrarlayan, Derin Cilt veya Organ Apseleri": 1, "Ağızda veya Deride Kalıcı Pamukçuk yada Mantar Enfeksiyonu": 1, "İntravenöz Antibiyotik Gerektiren Enfeksiyonlar": 1, "Septisemi Dâhil ≥2 Derin Enfeksiyon": 0, "Ailede Doğuştan İmmün Yetmezlik Öyküsü": 0, "CİNSİYET": 1, "YAŞ": 80, "Hastaneye Yatış Varlığı": 1, "BCG Aşısı Sonrası Lenfadenopati": 0, "Kronik Cilt (deri) Problemleri": 0, "Göbek Kordonunun Düşme Günü": 12, "Konjenital Kalp Hastalığı": 0, "Kronik İshal": 0, "Yoğun Bakımda Yatış": 0, "Anne-Baba Arasında Akrabalık Varlığı": 1, "Ailede Erken Ölüm Öyküsü": 0 }},
  { no: 11, yzSonucu: 1, data: { "1 Yıl İçinde Otit Sayısı ≥4": 1, "1 Yıl İçinde Sinüzit Sayısı ≥2": 1, "2 Aydan Fazla Oral Antibiyotik Kullanımı": 1, "1 yıl içinde ≥2 pnomoni": 1, "Bir Bebeğin Kilo Alamaması veya Normal Büyümemesi": 1, "Tekrarlayan, Derin Cilt veya Organ Apseleri": 0, "Ağızda veya Deride Kalıcı Pamukçuk yada Mantar Enfeksiyonu": 0, "İntravenöz Antibiyotik Gerektiren Enfeksiyonlar": 0, "Septisemi Dâhil ≥2 Derin Enfeksiyon": 0, "Ailede Doğuştan İmmün Yetmezlik Öyküsü": 0, "CİNSİYET": 1, "YAŞ": 12, "Hastaneye Yatış Varlığı": 0, "BCG Aşısı Sonrası Lenfadenopati": 0, "Kronik Cilt (deri) Problemleri": 1, "Göbek Kordonunun Düşme Günü": 12, "Konjenital Kalp Hastalığı": 0, "Kronik İshal": 0, "Yoğun Bakımda Yatış": 0, "Anne-Baba Arasında Akrabalık Varlığı": 1, "Ailede Erken Ölüm Öyküsü": 0 }},
];

async function predict(data) {
  const res = await fetch(`${ML_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function main() {
  console.log('='.repeat(70));
  console.log('ML API - 11 Hasta YZ SONUCU Karşılaştırma Testi');
  console.log('API:', ML_URL);
  console.log('='.repeat(70));

  const results = [];
  let matchCount = 0;

  for (const p of PATIENTS) {
    try {
      const api = await predict(p.data);
      const match = api.prediction === p.yzSonucu;
      if (match) matchCount++;
      results.push({
        no: p.no,
        yzSonucu: p.yzSonucu,
        apiPrediction: api.prediction,
        apiProb: api.probability,
        match: match ? '✓' : '✗'
      });
      console.log(`Hasta ${String(p.no).padStart(2)}: YZ=${p.yzSonucu} | API=${api.prediction} (prob: ${api.probability?.toFixed(3)}) | ${match ? '✓ UYUMLU' : '✗ FARKLI'}`);
    } catch (e) {
      console.log(`Hasta ${p.no}: HATA - ${e.message}`);
      results.push({ no: p.no, error: e.message });
    }
    await new Promise(r => setTimeout(r, 200)); // Rate limit
  }

  console.log('='.repeat(70));
  console.log(`SONUÇ: ${matchCount}/11 hasta YZ SONUCU ile uyumlu`);
  if (matchCount === 11) {
    console.log('✓ Tüm sonuçlar uyumlu!');
  } else {
    console.log('✗ Uyumsuz hastalar:');
    results.filter(r => !r.error && r.match === '✗').forEach(r => {
      console.log(`  - Hasta ${r.no}: YZ=${r.yzSonucu}, API=${r.apiPrediction}`);
    });
  }
  console.log('='.repeat(70));
}

main().catch(console.error);
