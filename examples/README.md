# ML Predict API - Örnek İstekler

Bu klasör, **Deneme Yapay Zeka.xlsx** JSON formatı ile uyumlu örnek istekleri içerir.

## Format Karşılaştırması

| Excel/JSON Kolonu | API Snake Case | Açıklama |
|-------------------|----------------|----------|
| 1 Yıl İçinde Otit Sayısı ≥4 | otit_sayisi_ge_4 | Sayı (≥4 ise risk) |
| 1 Yıl İçinde Sinüzit Sayısı ≥2 | sinuzit_sayisi_ge_2 | Sayı (≥2 ise risk) |
| 2 Aydan Fazla Oral Antibiyotik Kullanımı | iki_aydan_fazla_ab | 0/1 |
| 1 yıl içinde ≥2 pnomoni | pnomoni_ge_2 | Sayı (≥2 ise risk) |
| CİNSİYET | cinsiyet | 0=Erkek, 1=Kadın |
| YAŞ | yas | Yıl (float) |
| Göbek Kordonunun Düşme Günü | gobek_kordon_gunu | Gün sayısı |

**Her iki format da API tarafından kabul edilir.**

## cURL Örnekleri

### 1. JSON (Excel) formatı ile istek

```bash
curl -X POST https://immune-risk-ml-api.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### 2. Snake_case formatı ile istek (uygulama formatı)

```bash
curl -X POST https://immune-risk-ml-api.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{
    "otit_sayisi_ge_4": 5,
    "sinuzit_sayisi_ge_2": 4,
    "iki_aydan_fazla_ab": 0,
    "pnomoni_ge_2": 0,
    "kilo_alamama": 0,
    "tekrarlayan_apse": 0,
    "pamukcuk_mantar": 0,
    "iv_antibiyotik": 0,
    "derin_enf_ge_2": 0,
    "aile_oykusu_boy": 0,
    "cinsiyet": 1,
    "yas": 30,
    "hastane_yatis": 0,
    "bcg_lenfadenopati": 0,
    "kronik_cilt": 0,
    "gobek_kordon_gunu": 14,
    "konjenital_kalp": 0,
    "kronik_ishal": 0,
    "yogun_bakim": 0,
    "akrabalik": 0,
    "aile_erken_olum": 0
  }'
```

### Beklenen Yanıt

```json
{
  "prediction": 0,
  "probability": 0.002,
  "risk_level": "Düşük Risk",
  "message": "Rutin takip önerilir."
}
```

- `prediction`: 0 = Hasta değil, 1 = Hasta (risk var)
- `probability`: Tahmin olasılığı (0-1)

## Test Script

```bash
node scripts/test-ml-predict.js
```

Lokal ML API için:
```bash
ML_SERVICE_URL=http://localhost:8000 node scripts/test-ml-predict.js
```
