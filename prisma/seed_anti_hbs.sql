-- Anti-HBs referans değerleri seed data
-- Yaşa göre beklenen Anti-HBs değerleri

-- 0-12 ay (primer seri yeni tamamlanmış)
INSERT INTO anti_hbs_references (age_group_name, min_age_months, max_age_months, expected_min_value, expected_max_value, typical_range, seroprotection_threshold, seroprotection_rate, description, source_reference, is_booster_response)
VALUES (
  '0–12 ay (primer seri yeni tamamlanmış: 0–1–6 ay şeması)',
  0,
  12,
  10,
  NULL,
  'Çoğu çocuk: ≥ 10 — sıkça 100+ mIU/mL',
  10,
  '%90–%99+',
  'Primer seri yeni tamamlanmış bebeklerde %90–%99+ seroproteksiyon bildirilir; medyanlar sıklıkla yüksek (ör. ≥100). Özellikle 1–2 ay sonra yüksek; ≥100 sık görülür.',
  'BioMed Central',
  false
);

-- 1-4 yaş
INSERT INTO anti_hbs_references (age_group_name, min_age_months, max_age_months, expected_min_value, expected_max_value, typical_range, seroprotection_threshold, seroprotection_rate, description, source_reference, is_booster_response)
VALUES (
  '1–4 yaş',
  12,
  48,
  10,
  200,
  'Çoğunluk: ≥10 ve sıklıkla 10–200 mIU/mL',
  10,
  '%70–95',
  'Çok çocukta hala ≥100 bulunur ama dağılım genişler. Çalışmalarda seroproteksiyon çoğunlukla yüksek (%70–95 arası çalışmalar arasında değişir).',
  'Lippincott',
  false
);

-- 5-9 yaş
INSERT INTO anti_hbs_references (age_group_name, min_age_months, max_age_months, expected_min_value, expected_max_value, typical_range, seroprotection_threshold, seroprotection_rate, description, source_reference, is_booster_response)
VALUES (
  '5–9 yaş',
  60,
  108,
  NULL,
  150,
  'Ortalama düşüş başlar: tipik aralık ~<10 – 150 mIU/mL',
  10,
  '%60–85',
  'Birçok çocukta 10–100 arasında; bazılarında <10 görülebilir. Seroproteksiyon oranı yaşla azalır; bazı popülasyonlarda %60–85 civarında bildirilir (çalışmaya göre değişir).',
  'PMC',
  false
);

-- 10-14 yaş
INSERT INTO anti_hbs_references (age_group_name, min_age_months, max_age_months, expected_min_value, expected_max_value, typical_range, seroprotection_threshold, seroprotection_rate, description, source_reference, is_booster_response)
VALUES (
  '10–14 yaş',
  120,
  168,
  NULL,
  100,
  'Daha fazla düşüş: sık görülen aralık <10 – 100 mIU/mL',
  10,
  '%50–75',
  'Medyanlar genelde 10''un altına yakınlaşabilir. Birçok çalışmada ergenlik öncesi/ergenlikte seroproteksiyon oranı daha düşük (ör. ~%50–75); fakat anamnestic yanıt çoğunlukla korunur.',
  'Taylor & Francis Online',
  false
);

-- 15-18 yaş
INSERT INTO anti_hbs_references (age_group_name, min_age_months, max_age_months, expected_min_value, expected_max_value, typical_range, seroprotection_threshold, seroprotection_rate, description, source_reference, is_booster_response)
VALUES (
  '15–18 yaş',
  180,
  216,
  NULL,
  50,
  'Çoğunda <10 mIU/mL veya düşük pozitif (10–50)',
  10,
  '%40–70',
  'Birkaç kişide yüksek titreler devam eder. Seroproteksiyon oranı daha düşük olabilir (ör. çalışmaya göre %40–70); fakat uzun dönem korunma (hafıza) devam edebilir; yeni infeksiyon nadir.',
  'PMC',
  false
);

-- Booster sonrası (her yaş)
INSERT INTO anti_hbs_references (age_group_name, min_age_months, max_age_months, expected_min_value, expected_max_value, typical_range, seroprotection_threshold, seroprotection_rate, description, source_reference, is_booster_response)
VALUES (
  'Booster sonrası (her yaş)',
  0,
  NULL,
  10,
  NULL,
  'Tek doz hatırlatıcı sonrası çoğu kişide ≥10 mIU/mL (çoğunlukla çok daha yüksek, sıklıkla ≥100)',
  10,
  'Yüksek pozitif',
  'Anamnestic/booster yanıtı yüksek oranda pozitif serokonversiyon sağlar; bu nedenle düşük titreli kişilere verildiğinde genellikle koruma sağlanır.',
  'Immunize.org',
  true
);

