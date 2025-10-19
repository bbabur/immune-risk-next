import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import seedData from '@/prisma/patient-seed-data.json';

// Boolean parse helper
function parseBoolean(value: any): boolean {
  if (!value) return false;
  if (typeof value === 'boolean') return value;
  const str = String(value).toLowerCase().trim();
  return str === 'evet' || str === 'var' || str === 'yes' || str === 'true' || str === '1' || str === '+' || str === 'e';
}

// Number parse helper
function parseNumber(value: any): number | null {
  if (!value) return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

export async function POST() {
  try {
    console.log(`🌱 Seed başlıyor: ${seedData.length} hasta`);
    
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < seedData.length; i++) {
      const patientData = seedData[i] as any;
      
      try {
        await prisma.$transaction(async (tx) => {
          // Hasta oluştur
          const patient = await tx.patient.create({
            data: {
              firstName: patientData.firstName || '',
              lastName: patientData.lastName || '',
              birthDate: patientData.birthDate || new Date().toISOString(),
              gender: patientData.gender || 'Bilinmiyor',
              birthWeight: parseNumber(patientData.birthWeight),
              gestationalAge: parseNumber(patientData.gestationalAge),
              birthType: patientData.birthType ? String(patientData.birthType) : null,
              breastfeedingMonths: parseNumber(patientData.breastfeedingMonths),
              hasImmuneDeficiency: true,
              diagnosisType: 'İmmün Yetmezlik',
              height: null,
              weight: null,
              ethnicity: null,
              cordFallDay: parseNumber(patientData.rawData?.['GÖBEK DÜŞME ZAMANI']),
              parentalConsanguinity: parseBoolean(patientData.rawData?.['AKRABALIK']),
              ruleBasedScore: parseNumber(patientData.rawData?.['JEFREY PUANI']),
              finalRiskLevel: patientData.rawData?.['TANI İÇİN YOL GÖSTERİCİ  BULGU (JEFREY MODEL\'E GÖRE)'] ? String(patientData.rawData['TANI İÇİN YOL GÖSTERİCİ  BULGU (JEFREY MODEL\'E GÖRE)']) : null,
            }
          });

          // Klinik özellikler ekle
          await tx.clinicalFeature.create({
            data: {
              patientId: patient.id,
              growthFailure: parseBoolean(patientData.rawData?.['BÜYÜME GERİLİĞİ']),
              chronicSkinIssue: parseBoolean(patientData.rawData?.['CİLT PROBLEMİ']),
              chronicDiarrhea: parseBoolean(patientData.rawData?.['İSHAL']),
              bcgLymphadenopathy: parseBoolean(patientData.rawData?.['BCG SONRASI LAP']),
              persistentThrush: parseBoolean(patientData.rawData?.['PAMUKÇUK']),
              deepAbscesses: parseBoolean(patientData.rawData?.['ABSE SIKLIĞI']),
              chd: parseBoolean(patientData.rawData?.['KALP HASTALIĞI']),
              heightPercentile: null,
              weightPercentile: null,
              skinIssueType: null,
              skinIssueDuration: null,
              diarrheaDuration: null,
              abscessLocation: null,
              chdType: null,
            }
          });

          // Hastaneye yatış varsa ekle
          if (patientData.hasHospitalization) {
            await tx.hospitalization.create({
              data: {
                patientId: patient.id,
                admissionDate: new Date().toISOString(),
                reason: patientData.rawData?.['YATIŞ NEDENİ'] || 'Bilinmiyor',
                icuAdmission: parseBoolean(patientData.rawData?.['YBÜ YATIŞI']),
                icuDays: patientData.icuDaysInMonths ? patientData.icuDaysInMonths * 30 : null,
                ivAntibioticRequirement: parseBoolean(patientData.rawData?.['IV AB TEDAVİSİ']),
                diagnosis: null,
                dischargeDate: null,
                antibioticsUsed: null,
                notes: null,
              }
            });
          }

          // Enfeksiyon verileri varsa ekle
          const hasInfections = patientData.rawData?.['KULAK ENFEKSİYONU SIKLIĞI'] || 
                               patientData.rawData?.['SİNÜS ENFEKSİYONU SIKLIĞI'] || 
                               patientData.rawData?.['ASYE SIKLIĞI'];
          
          if (hasInfections) {
            await tx.infection.create({
              data: {
                patientId: patient.id,
                type: 'Çoklu enfeksiyon',
                severity: 'Orta',
                date: null,
                treatment: null,
                antibioticUsed: null,
                antibioticFailure: parseBoolean(patientData.rawData?.['ETKİSİZ/ UZUN AB TEDAVİSİ']),
                hospitalizationRequired: patientData.hasHospitalization,
                hospitalizationId: null,
              }
            });
          }

          // Aile öyküsü
          const hasFamilyHistory = parseBoolean(patientData.rawData?.['AİLEDE PİY']) ||
                                   parseBoolean(patientData.rawData?.['AİLEDE TBC']) ||
                                   parseBoolean(patientData.rawData?.['AİLEDE KALP']) ||
                                   parseBoolean(patientData.rawData?.['AİLEDE ROMATİZMA']) ||
                                   parseBoolean(patientData.rawData?.['AİLEDE ALERJİ']) ||
                                   parseBoolean(patientData.rawData?.['AİLEDE KANSER']);

          if (hasFamilyHistory) {
            const conditions = [];
            if (parseBoolean(patientData.rawData?.['AİLEDE PİY'])) conditions.push('PIY');
            if (parseBoolean(patientData.rawData?.['AİLEDE TBC'])) conditions.push('Tüberküloz');
            if (parseBoolean(patientData.rawData?.['AİLEDE KALP'])) conditions.push('Kalp Hastalığı');
            if (parseBoolean(patientData.rawData?.['AİLEDE ROMATİZMA'])) conditions.push('Romatizma');
            if (parseBoolean(patientData.rawData?.['AİLEDE ALERJİ'])) conditions.push('Alerji');
            if (parseBoolean(patientData.rawData?.['AİLEDE KANSER'])) conditions.push('Kanser');

            await tx.familyHistory.create({
              data: {
                patientId: patient.id,
                familyIeiHistory: parseBoolean(patientData.rawData?.['AİLEDE PİY']),
                ieiRelationship: patientData.rawData?.['DERECESİ'] ? String(patientData.rawData['DERECESİ']) : null,
                ieiType: conditions.join(', ') || null,
                familyEarlyDeath: parseBoolean(patientData.rawData?.['ERKEN EX']),
                earlyDeathAge: null,
                earlyDeathCause: null,
                earlyDeathRelationship: null,
                otherConditions: conditions.filter(c => c !== 'PIY').join(', ') || null,
              }
            });
          }
        });

        successCount++;
        if (successCount % 50 === 0) {
          console.log(`✅ ${successCount}/${seedData.length} hasta eklendi...`);
        }
      } catch (error) {
        errorCount++;
        const errorMsg = error instanceof Error ? error.message : 'Bilinmeyen hata';
        errors.push(`Hasta ${i + 1} (${patientData.firstName}): ${errorMsg}`);
        console.error(`❌ Hata (${i + 1}):`, errorMsg);
      }
    }

    console.log(`\n🎉 Seed tamamlandı!`);
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Başarısız: ${errorCount}`);

    return NextResponse.json({
      success: true,
      message: `Seed tamamlandı: ${successCount} başarılı, ${errorCount} başarısız`,
      results: {
        success: successCount,
        failed: errorCount,
        errors: errors.slice(0, 10) // İlk 10 hatayı göster
      }
    });

  } catch (error) {
    console.error('❌ Seed hatası:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Seed işlemi başarısız', 
        details: error instanceof Error ? error.message : 'Bilinmeyen hata' 
      },
      { status: 500 }
    );
  }
}

// GET endpoint - seed status
export async function GET() {
  try {
    const patientCount = await prisma.patient.count();
    
    return NextResponse.json({
      currentPatients: patientCount,
      seedDataCount: seedData.length,
      isSeeded: patientCount >= seedData.length,
      message: patientCount >= seedData.length 
        ? 'Veriler zaten yüklenmiş görünüyor' 
        : `${seedData.length} hasta verisi yüklenmeye hazır`
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Status kontrolü başarısız' },
      { status: 500 }
    );
  }
}

