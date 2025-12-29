-- ML Değerlendirme Sonuçları için yeni alanlar
ALTER TABLE "risk_assessments" ADD COLUMN IF NOT EXISTS "ml_prediction" INTEGER;
ALTER TABLE "risk_assessments" ADD COLUMN IF NOT EXISTS "ml_probability" DOUBLE PRECISION;
ALTER TABLE "risk_assessments" ADD COLUMN IF NOT EXISTS "ml_risk_level" TEXT;
ALTER TABLE "risk_assessments" ADD COLUMN IF NOT EXISTS "ml_features" JSONB;

-- Yorum: ml_prediction = 0 (Risk yok), 1 (Risk var)
-- Yorum: ml_probability = 0-1 arası tahmin olasılığı
-- Yorum: ml_risk_level = Risk seviyesi açıklaması
-- Yorum: ml_features = Değerlendirmede kullanılan 21 özellik

