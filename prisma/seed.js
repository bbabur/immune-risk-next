const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const patientData = [
  {
    firstName: "Ahmet",
    lastName: "Yılmaz",
    birthDate: "2018-03-15",
    gender: "Erkek",
    height: 85.5,
    weight: 12.3,
    ethnicity: "Türk",
    birthWeight: 3.2,
    gestationalAge: 38,
    cordFallDay: 10,
    parentalConsanguinity: false,
    ruleBasedScore: 7,
    mlScore: 0.65,
    finalRiskLevel: "Orta",
    hasImmuneDeficiency: false
  },
  {
    firstName: "Zeynep",
    lastName: "Demir",
    birthDate: "2019-07-22",
    gender: "Kız",
    height: 78.2,
    weight: 10.8,
    ethnicity: "Türk",
    birthWeight: 2.8,
    gestationalAge: 37,
    cordFallDay: 12,
    parentalConsanguinity: true,
    ruleBasedScore: 12,
    mlScore: 0.85,
    finalRiskLevel: "Yüksek",
    hasImmuneDeficiency: true,
    diagnosisType: "SCID",
    diagnosisDate: "2020-01-15"
  },
  {
    firstName: "Mehmet",
    lastName: "Kaya",
    birthDate: "2020-01-10",
    gender: "Erkek",
    height: 70.1,
    weight: 8.9,
    ethnicity: "Türk",
    birthWeight: 3.1,
    gestationalAge: 39,
    cordFallDay: 8,
    parentalConsanguinity: false,
    ruleBasedScore: 4,
    mlScore: 0.35,
    finalRiskLevel: "Düşük",
    hasImmuneDeficiency: false
  },
  {
    firstName: "Ayşe",
    lastName: "Özkan",
    birthDate: "2017-11-30",
    gender: "Kız",
    height: 92.3,
    weight: 14.7,
    ethnicity: "Türk",
    birthWeight: 2.9,
    gestationalAge: 36,
    cordFallDay: 15,
    parentalConsanguinity: true,
    ruleBasedScore: 15,
    mlScore: 0.92,
    finalRiskLevel: "Yüksek",
    hasImmuneDeficiency: true,
    diagnosisType: "CVID",
    diagnosisDate: "2019-05-20"
  },
  {
    firstName: "Ali",
    lastName: "Çelik",
    birthDate: "2021-04-05",
    gender: "Erkek",
    height: 65.8,
    weight: 7.2,
    ethnicity: "Türk",
    birthWeight: 3.4,
    gestationalAge: 40,
    cordFallDay: 7,
    parentalConsanguinity: false,
    ruleBasedScore: 6,
    mlScore: 0.45,
    finalRiskLevel: "Orta",
    hasImmuneDeficiency: false
  },
  {
    firstName: "Fatma",
    lastName: "Arslan",
    birthDate: "2018-09-18",
    gender: "Kız",
    height: 88.9,
    weight: 13.1,
    ethnicity: "Türk",
    birthWeight: 3.0,
    gestationalAge: 38,
    cordFallDay: 11,
    parentalConsanguinity: false,
    ruleBasedScore: 8,
    mlScore: 0.58,
    finalRiskLevel: "Orta",
    hasImmuneDeficiency: false
  },
  {
    firstName: "Emre",
    lastName: "Şahin",
    birthDate: "2019-12-12",
    gender: "Erkek",
    height: 82.4,
    weight: 11.5,
    ethnicity: "Türk",
    birthWeight: 2.7,
    gestationalAge: 35,
    cordFallDay: 18,
    parentalConsanguinity: true,
    ruleBasedScore: 18,
    mlScore: 0.95,
    finalRiskLevel: "Yüksek",
    hasImmuneDeficiency: true,
    diagnosisType: "DiGeorge Sendromu",
    diagnosisDate: "2020-08-10"
  },
  {
    firstName: "Elif",
    lastName: "Yıldız",
    birthDate: "2020-06-25",
    gender: "Kız",
    height: 75.6,
    weight: 9.8,
    ethnicity: "Türk",
    birthWeight: 3.3,
    gestationalAge: 39,
    cordFallDay: 9,
    parentalConsanguinity: false,
    ruleBasedScore: 3,
    mlScore: 0.25,
    finalRiskLevel: "Düşük",
    hasImmuneDeficiency: false
  },
  {
    firstName: "Burak",
    lastName: "Güler",
    birthDate: "2017-05-08",
    gender: "Erkek",
    height: 95.2,
    weight: 16.4,
    ethnicity: "Türk",
    birthWeight: 3.5,
    gestationalAge: 41,
    cordFallDay: 6,
    parentalConsanguinity: false,
    ruleBasedScore: 5,
    mlScore: 0.42,
    finalRiskLevel: "Orta",
    hasImmuneDeficiency: false
  },
  {
    firstName: "Selin",
    lastName: "Koç",
    birthDate: "2021-08-14",
    gender: "Kız",
    height: 62.1,
    weight: 6.9,
    ethnicity: "Türk",
    birthWeight: 2.6,
    gestationalAge: 34,
    cordFallDay: 20,
    parentalConsanguinity: true,
    ruleBasedScore: 14,
    mlScore: 0.88,
    finalRiskLevel: "Yüksek",
    hasImmuneDeficiency: true,
    diagnosisType: "Wiskott-Aldrich Sendromu",
    diagnosisDate: "2022-02-28"
  }
];

const clinicalFeaturesData = [
  {
    patientId: 1,
    growthFailure: false,
    heightPercentile: 50.0,
    weightPercentile: 45.0,
    chronicSkinIssue: false,
    chronicDiarrhea: false,
    bcgLymphadenopathy: false,
    persistentThrush: false,
    deepAbscesses: false,
    chd: false
  },
  {
    patientId: 2,
    growthFailure: true,
    heightPercentile: 10.0,
    weightPercentile: 8.0,
    chronicSkinIssue: true,
    skinIssueType: "Ekzema",
    skinIssueDuration: 6,
    chronicDiarrhea: true,
    diarrheaDuration: 4,
    bcgLymphadenopathy: true,
    persistentThrush: true,
    deepAbscesses: true,
    abscessLocation: "Boyun",
    chd: false
  },
  {
    patientId: 3,
    growthFailure: false,
    heightPercentile: 75.0,
    weightPercentile: 70.0,
    chronicSkinIssue: false,
    chronicDiarrhea: false,
    bcgLymphadenopathy: false,
    persistentThrush: false,
    deepAbscesses: false,
    chd: false
  },
  {
    patientId: 4,
    growthFailure: true,
    heightPercentile: 5.0,
    weightPercentile: 3.0,
    chronicSkinIssue: true,
    skinIssueType: "Seboreik dermatit",
    skinIssueDuration: 12,
    chronicDiarrhea: true,
    diarrheaDuration: 8,
    bcgLymphadenopathy: false,
    persistentThrush: true,
    deepAbscesses: false,
    chd: true,
    chdType: "VSD"
  },
  {
    patientId: 5,
    growthFailure: false,
    heightPercentile: 60.0,
    weightPercentile: 55.0,
    chronicSkinIssue: false,
    chronicDiarrhea: false,
    bcgLymphadenopathy: false,
    persistentThrush: false,
    deepAbscesses: false,
    chd: false
  }
];

async function main() {
  console.log('🌱 Dummy hasta kayıtları oluşturuluyor...');
  
  // Önce mevcut kayıtları temizle
  await prisma.clinicalFeature.deleteMany({});
  await prisma.patient.deleteMany({});
  
  // Hasta kayıtlarını oluştur
  for (const patient of patientData) {
    await prisma.patient.create({
      data: patient
    });
  }
  
  // Klinik özellik kayıtlarını oluştur
  for (const clinicalFeature of clinicalFeaturesData) {
    await prisma.clinicalFeature.create({
      data: clinicalFeature
    });
  }
  
  console.log('✅ 10 dummy hasta kaydı başarıyla oluşturuldu!');
  console.log('📊 Hasta dağılımı:');
  console.log('   - Sağlıklı: 6 hasta');
  console.log('   - İmmün yetmezlik: 4 hasta');
  console.log('   - Düşük risk: 2 hasta');
  console.log('   - Orta risk: 4 hasta');
  console.log('   - Yüksek risk: 4 hasta');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 