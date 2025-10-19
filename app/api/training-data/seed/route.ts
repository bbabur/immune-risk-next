import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import seedData from '@/prisma/patient-seed-data.json';

// Helper functions
function parseBoolean(value: any): boolean {
  if (!value) return false;
  if (typeof value === 'boolean') return value;
  const str = String(value).toLowerCase().trim();
  return str === 'evet' || str === 'var' || str === 'yes' || str === 'true' || str === '1' || str === '+' || str === 'e';
}

function parseNumber(value: any): number | null {
  if (!value) return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

function calculateAgeInMonths(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  return Math.max(0, months);
}

export async function POST() {
  try {
    // Önce mevcut veri var mı kontrol et
    const existingCount = await prisma.trainingPatient.count();
    
    if (existingCount > 0) {
      return NextResponse.json({
        success: false,
        message: `Veritabanında zaten ${existingCount} kayıt var. Silmek için DELETE /api/training-data kullanın.`,
        currentCount: existingCount
      }, { status: 400 });
    }

    console.log(`🌱 Training Data Seed başlıyor: ${seedData.length} kayıt`);
    
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < seedData.length; i++) {
      const patientData = seedData[i] as any;
      
      try {
        // Klinik özellikleri JSON olarak hazırla
        const clinicalFeatures = {
          growthFailure: parseBoolean(patientData.rawData?.['BÜYÜME GERİLİĞİ']),
          chronicSkinIssue: parseBoolean(patientData.rawData?.['CİLT PROBLEMİ']),
          chronicDiarrhea: parseBoolean(patientData.rawData?.['İSHAL']),
          bcgLymphadenopathy: parseBoolean(patientData.rawData?.['BCG SONRASI LAP']),
          persistentThrush: parseBoolean(patientData.rawData?.['PAMUKÇUK']),
          deepAbscesses: parseBoolean(patientData.rawData?.['ABSE SIKLIĞI']),
          chd: parseBoolean(patientData.rawData?.['KALP HASTALIĞI']),
        };

        const infections = {
          hasInfections: !!(patientData.rawData?.['KULAK ENFEKSİYONU SIKLIĞI'] || 
                           patientData.rawData?.['SİNÜS ENFEKSİYONU SIKLIĞI'] || 
                           patientData.rawData?.['ASYE SIKLIĞI']),
          antibioticFailure: parseBoolean(patientData.rawData?.['ETKİSİZ/ UZUN AB TEDAVİSİ']),
        };

        const hospitalizations = {
          hasHospitalization: patientData.hasHospitalization,
          icuAdmission: parseBoolean(patientData.rawData?.['YBÜ YATIŞI']),
          icuDays: patientData.icuDaysInMonths ? patientData.icuDaysInMonths * 30 : null,
          reason: patientData.rawData?.['YATIŞ NEDENİ'],
        };

        const familyHistory = {
          piy: parseBoolean(patientData.rawData?.['AİLEDE PİY']),
          tbc: parseBoolean(patientData.rawData?.['AİLEDE TBC']),
          heart: parseBoolean(patientData.rawData?.['AİLEDE KALP']),
          rheumatism: parseBoolean(patientData.rawData?.['AİLEDE ROMATİZMA']),
          allergy: parseBoolean(patientData.rawData?.['AİLEDE ALERJİ']),
          cancer: parseBoolean(patientData.rawData?.['AİLEDE KANSER']),
          relationship: patientData.rawData?.['DERECESİ'] ? String(patientData.rawData['DERECESİ']) : null,
          earlyDeath: parseBoolean(patientData.rawData?.['ERKEN EX']),
        };

        // Dosya numarasını al
        const fileNo = patientData.rawData?.['DOSYA NO'] || (i + 1);
        
        await prisma.trainingPatient.create({
          data: {
            patientCode: `${fileNo}`,
            ageMonths: calculateAgeInMonths(patientData.birthDate),
            gender: patientData.gender || 'Bilinmiyor',
            birthWeight: parseNumber(patientData.birthWeight),
            gestationalAge: parseNumber(patientData.gestationalAge),
            birthType: patientData.birthType ? String(patientData.birthType) : null,
            breastfeedingMonths: parseNumber(patientData.breastfeedingMonths),
            cordFallDay: parseNumber(patientData.rawData?.['GÖBEK DÜŞME ZAMANI']),
            parentalConsanguinity: parseBoolean(patientData.rawData?.['AKRABALIK']),
            clinicalFeatures: clinicalFeatures as any,
            infections: infections as any,
            hospitalizations: hospitalizations as any,
            familyHistory: familyHistory as any,
            hasImmuneDeficiency: true,
            diagnosisType: 'İmmün Yetmezlik',
            ruleBasedScore: parseNumber(patientData.rawData?.['JEFREY PUANI']),
            finalRiskLevel: patientData.rawData?.['TANI İÇİN YOL GÖSTERİCİ  BULGU (JEFREY MODEL\'E GÖRE)'] 
              ? String(patientData.rawData['TANI İÇİN YOL GÖSTERİCİ  BULGU (JEFREY MODEL\'E GÖRE)']) 
              : null,
            sourceFile: 'ANA TABLO.xlsx',
            notes: null,
          }
        });

        successCount++;
        if (successCount % 50 === 0) {
          console.log(`✅ ${successCount}/${seedData.length} eğitim verisi eklendi...`);
        }
      } catch (error) {
        errorCount++;
        const errorMsg = error instanceof Error ? error.message : 'Bilinmeyen hata';
        errors.push(`Kayıt ${i + 1} (${patientData.firstName}): ${errorMsg}`);
        console.error(`❌ Hata (${i + 1}):`, errorMsg);
      }
    }

    console.log(`\n🎉 Training Data Seed tamamlandı!`);
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Başarısız: ${errorCount}`);

    return NextResponse.json({
      success: true,
      message: `Training data seed tamamlandı: ${successCount} başarılı, ${errorCount} başarısız`,
      results: {
        success: successCount,
        failed: errorCount,
        errors: errors.slice(0, 10)
      }
    });

  } catch (error) {
    console.error('❌ Training data seed hatası:', error);
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

// GET - seed status
export async function GET() {
  try {
    const count = await prisma.trainingPatient.count();
    
    return NextResponse.json({
      currentCount: count,
      expectedCount: 200,
      isSeeded: count >= 200,
      message: count >= 200 
        ? 'Training data zaten yüklenmiş' 
        : `${200 - count} kayıt yüklenmeye hazır`
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Status kontrolü başarısız' },
      { status: 500 }
    );
  }
}

