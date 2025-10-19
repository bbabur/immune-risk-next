import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Önce mevcut verileri temizle
    await prisma.antiHbsReference.deleteMany({});

    // Referans verilerini ekle
    const references = [
      {
        ageGroupName: '0–12 ay (primer seri yeni tamamlanmış: 0–1–6 ay şeması)',
        minAgeMonths: 0,
        maxAgeMonths: 12,
        expectedMinValue: 10,
        expectedMaxValue: null,
        typicalRange: 'Çoğu çocuk: ≥ 10 — sıkça 100+ mIU/mL',
        seroprotectionThreshold: 10,
        seroprotectionRate: '%90–%99+',
        description: 'Primer seri yeni tamamlanmış bebeklerde %90–%99+ seroproteksiyon bildirilir; medyanlar sıklıkla yüksek (ör. ≥100). Özellikle 1–2 ay sonra yüksek; ≥100 sık görülür.',
        sourceReference: 'BioMed Central',
        isBoosterResponse: false
      },
      {
        ageGroupName: '1–4 yaş',
        minAgeMonths: 12,
        maxAgeMonths: 48,
        expectedMinValue: 10,
        expectedMaxValue: 200,
        typicalRange: 'Çoğunluk: ≥10 ve sıklıkla 10–200 mIU/mL',
        seroprotectionThreshold: 10,
        seroprotectionRate: '%70–95',
        description: 'Çok çocukta hala ≥100 bulunur ama dağılım genişler. Çalışmalarda seroproteksiyon çoğunlukla yüksek (%70–95 arası çalışmalar arasında değişir).',
        sourceReference: 'Lippincott',
        isBoosterResponse: false
      },
      {
        ageGroupName: '5–9 yaş',
        minAgeMonths: 60,
        maxAgeMonths: 108,
        expectedMinValue: null,
        expectedMaxValue: 150,
        typicalRange: 'Ortalama düşüş başlar: tipik aralık ~<10 – 150 mIU/mL',
        seroprotectionThreshold: 10,
        seroprotectionRate: '%60–85',
        description: 'Birçok çocukta 10–100 arasında; bazılarında <10 görülebilir. Seroproteksiyon oranı yaşla azalır; bazı popülasyonlarda %60–85 civarında bildirilir (çalışmaya göre değişir).',
        sourceReference: 'PMC',
        isBoosterResponse: false
      },
      {
        ageGroupName: '10–14 yaş',
        minAgeMonths: 120,
        maxAgeMonths: 168,
        expectedMinValue: null,
        expectedMaxValue: 100,
        typicalRange: 'Daha fazla düşüş: sık görülen aralık <10 – 100 mIU/mL',
        seroprotectionThreshold: 10,
        seroprotectionRate: '%50–75',
        description: 'Medyanlar genelde 10\'un altına yakınlaşabilir. Birçok çalışmada ergenlik öncesi/ergenlikte seroproteksiyon oranı daha düşük (ör. ~%50–75); fakat anamnestic yanıt çoğunlukla korunur.',
        sourceReference: 'Taylor & Francis Online',
        isBoosterResponse: false
      },
      {
        ageGroupName: '15–18 yaş',
        minAgeMonths: 180,
        maxAgeMonths: 216,
        expectedMinValue: null,
        expectedMaxValue: 50,
        typicalRange: 'Çoğunda <10 mIU/mL veya düşük pozitif (10–50)',
        seroprotectionThreshold: 10,
        seroprotectionRate: '%40–70',
        description: 'Birkaç kişide yüksek titreler devam eder. Seroproteksiyon oranı daha düşük olabilir (ör. çalışmaya göre %40–70); fakat uzun dönem korunma (hafıza) devam edebilir; yeni infeksiyon nadir.',
        sourceReference: 'PMC',
        isBoosterResponse: false
      },
      {
        ageGroupName: 'Booster sonrası (her yaş)',
        minAgeMonths: 0,
        maxAgeMonths: null,
        expectedMinValue: 10,
        expectedMaxValue: null,
        typicalRange: 'Tek doz hatırlatıcı sonrası çoğu kişide ≥10 mIU/mL (çoğunlukla çok daha yüksek, sıklıkla ≥100)',
        seroprotectionThreshold: 10,
        seroprotectionRate: 'Yüksek pozitif',
        description: 'Anamnestic/booster yanıtı yüksek oranda pozitif serokonversiyon sağlar; bu nedenle düşük titreli kişilere verildiğinde genellikle koruma sağlanır.',
        sourceReference: 'Immunize.org',
        isBoosterResponse: true
      }
    ];

    // Tüm referansları ekle
    for (const ref of references) {
      await prisma.antiHbsReference.create({
        data: ref
      });
    }

    return NextResponse.json({
      message: 'Anti-HBs referans verileri başarıyla eklendi',
      count: references.length
    });
  } catch (error) {
    console.error('Anti-HBs seed hatası:', error);
    return NextResponse.json(
      { error: 'Seed işlemi başarısız', details: error instanceof Error ? error.message : 'Bilinmeyen hata' },
      { status: 500 }
    );
  }
}

