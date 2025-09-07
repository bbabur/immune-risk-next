import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ImportPatientData {
  // Excel başlıklarına uygun şekilde düzenlendi - flexible field mapping
  'sıra'?: number;
  'dosya no'?: string;
  'ad'?: string;
  'Ad'?: string;
  'ADI'?: string;
  'İsim'?: string;
  'isim'?: string;
  'first_name'?: string;
  'firstName'?: string;
  'cins'?: string;
  'Cins'?: string;
  'CINS'?: string;
  'Cinsiyet'?: string;
  'cinsiyet'?: string;
  'Sex'?: string;
  'sex'?: string;
  'gender'?: string;
  'yaş-ay'?: number;
  'doğum şekli'?: string;
  'doğum kilo'?: number;
  'doğum hf'?: number;
  'as süresi'?: number;
  'hastane yatış'?: string;
  'yatış zamanı ay'?: number;
  'yatış nedeni'?: string;
  'hastalanma sıklığı/yıl'?: number;
  'otit sıklığı/yıl'?: number;
  'sinüzit sıklığı/yıl'?: number;
  'oral ab'?: string;
  'asye sıklığı/yıl'?: number;
  'abse'?: string;
  'büyüme'?: string;
  'pamukçuk'?: string;
  'ıv ab'?: string;
  'sepsis'?: string;
  'uçuk/yıl'?: number;
  'aşı komp'?: string;
  'bcg akıntı'?: string;
  'bcg lap'?: string;
  'cilt prob'?: string;
  'göbek düşme-gün'?: number;
  'süt dişi dökülmesi'?: string;
  'yara iyileşmesi'?: string;
  'havale'?: string;
  'kalp hast'?: string;
  'ishal'?: string;
  'ybü'?: string;
  'yüzde farklılık'?: string;
  'kanama'?: string;
  'ağız yarası'?: string;
  'öğrenme güçlüğü'?: string;
  'yürüme'?: string;
  'akrabalık'?: string;
  'derecesi'?: string;
  'erken ex'?: string;
  'aile piy'?: string;
  'aile tbc'?: string;
  'aile kalp'?: string;
  'aile romatizma'?: string;
  'aile alerji'?: string;
  'aile kanser'?: string;
  'immunoya başvuru şik'?: string;
  'şik baş yaşı-ay'?: number;
  'ana tanı'?: string;
  'gis patolojileri'?: string;
  'eşlik eden güs patolojileri'?: string;
  'eşlik eden santral patolojiler'?: string;
  'eşlik eden endokrin patolojileri'?: string;
  'eşlik eden tanılar-kr akc hastalığı'?: string;
  "9'lu sınıflama"?: string;
  "4'lü sınıflama"?: string;
  '4/>4 otit'?: string;
  '2/>2 sinüzit'?: string;
  '2/>2 asye'?: string;
  'jefrey puanı'?: number;
  'ek klinik bulgu puanı'?: number;
  'ıgg düşüklüğü'?: string;
  'ıga düşüklüğü'?: string;
  'ıgm düşüklüğü'?: string;
  'ıge yüksekliği'?: string;
  'enfeksiyonun ağır seyretmesi'?: string;
  'tam kan tablosunda değişiklik'?: string;
  'timus yokluğu'?: string;
  'ıy tanı yaşı- ay'?: number;
  'tanıdaki gecikme-ay'?: number;
  'tedavi başlanngıç yaşı-ay'?: number;
  'tedavi süresi-ay'?: number;
  'tedavi kesme yaşı-ay'?: number;
  'takip süresi-ay'?: number;
  'ek klinik bulgu'?: string;
  'jefrey modele göre olanlar'?: string;
  'kr hastalık'?: string;
  'tanı'?: string;
}

// Evet/Hayır/Var/Yok string'lerini boolean'a çevir
function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  const lower = value.toLowerCase().trim();
  return lower === 'evet' || lower === 'var' || lower === 'yes' || lower === 'true' || lower === '1' || lower === '+';
}

// Yaş ay değerinden doğum tarihini hesapla
function calculateBirthDate(ageInMonths: number | undefined): string | null {
  if (!ageInMonths) return null;
  const now = new Date();
  const birthDate = new Date(now);
  birthDate.setMonth(birthDate.getMonth() - ageInMonths);
  return birthDate.toISOString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patients } = body;

    if (!Array.isArray(patients)) {
      return NextResponse.json(
        { error: 'Patients array is required' },
        { status: 400 }
      );
    }

    // Debug: Log first patient's keys to see actual column headers
    if (patients.length > 0) {
      console.log('Available columns:', Object.keys(patients[0]));
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < patients.length; i++) {
      const patientData = patients[i] as ImportPatientData;
      
      try {
        // Flexible field mapping
        const firstName = patientData['ad'] || patientData['Ad'] || patientData['ADI'] || patientData['İsim'] || patientData['isim'] || patientData['first_name'] || patientData['firstName'];
        const gender = patientData['cins'] || patientData['Cins'] || patientData['CINS'] || patientData['Cinsiyet'] || patientData['cinsiyet'] || patientData['Sex'] || patientData['sex'] || patientData['gender'];

        // Validate required fields
        if (!firstName || !gender) {
          results.failed++;
          results.errors.push(`Satır ${i + 1}: Zorunlu alanlar eksik (ad: '${firstName}', cins: '${gender}')`);
          continue;
        }

        // Calculate birth date from age in months
        const birthDate = calculateBirthDate(patientData['yaş-ay']);

        // Create patient with transaction
        await prisma.$transaction(async (tx) => {
          const patient = await tx.patient.create({
            data: {
              firstName: firstName || '',
              lastName: '', // Excel'de soyad ayrı kolonu yok
              birthDate: birthDate || new Date().toISOString(),
              gender: gender || '',
              height: null, // Excel'de boy bilgisi yok
              weight: null, // Excel'de kilo bilgisi yok  
              ethnicity: null,
              birthWeight: patientData['doğum kilo'] ? Number(patientData['doğum kilo']) : null,
              gestationalAge: patientData['doğum hf'] ? Number(patientData['doğum hf']) : null,
              cordFallDay: patientData['göbek düşme-gün'] ? Number(patientData['göbek düşme-gün']) : null,
              parentalConsanguinity: parseBoolean(patientData['akrabalık']),
              hasImmuneDeficiency: parseBoolean(patientData['tanı']),
              diagnosisType: patientData['ana tanı'] || null,
              diagnosisDate: null, // Tarih formatında veri yok
              finalRiskLevel: patientData["4'lü sınıflama"] || null,
            }
          });

          // Add clinical features
          await tx.clinicalFeature.create({
            data: {
              patientId: patient.id,
              growthFailure: parseBoolean(patientData['büyüme']),
              chronicSkinIssue: parseBoolean(patientData['cilt prob']),
              chronicDiarrhea: parseBoolean(patientData['ishal']),
              bcgLymphadenopathy: parseBoolean(patientData['bcg lap']),
              persistentThrush: parseBoolean(patientData['pamukçuk']),
              deepAbscesses: parseBoolean(patientData['abse']),
              chd: parseBoolean(patientData['kalp hast']),
            }
          });

          // Add infections data
          if (patientData['otit sıklığı/yıl'] || patientData['sinüzit sıklığı/yıl'] || patientData['asye sıklığı/yıl']) {
            await tx.infection.create({
              data: {
                patientId: patient.id,
                type: 'Çoklu enfeksiyon',
                severity: 'Orta',
                treatment: patientData['oral ab'] || null,
                antibioticUsed: patientData['oral ab'] || null,
                antibioticFailure: false,
                hospitalizationRequired: parseBoolean(patientData['hastane yatış']),
              }
            });
          }

          // Add hospitalization data if exists
          if (parseBoolean(patientData['hastane yatış'])) {
            await tx.hospitalization.create({
              data: {
                patientId: patient.id,
                admissionDate: new Date().toISOString(),
                reason: patientData['yatış nedeni'] || 'Bilinmiyor',
                diagnosis: patientData['ana tanı'] || null,
                icuAdmission: parseBoolean(patientData['ybü']),
                icuDays: patientData['yatış zamanı ay'] ? Number(patientData['yatış zamanı ay']) * 30 : null,
                ivAntibioticRequirement: parseBoolean(patientData['ıv ab']),
                antibioticsUsed: patientData['oral ab'] || null,
                notes: null,
              }
            });
          }

          // Add family history
          const hasAnyFamilyHistory = parseBoolean(patientData['aile piy']) || 
                                     parseBoolean(patientData['aile tbc']) || 
                                     parseBoolean(patientData['aile kalp']) ||
                                     parseBoolean(patientData['aile romatizma']) ||
                                     parseBoolean(patientData['aile alerji']) ||
                                     parseBoolean(patientData['aile kanser']);

          if (hasAnyFamilyHistory) {
            const conditions = [];
            if (parseBoolean(patientData['aile piy'])) conditions.push('PIY');
            if (parseBoolean(patientData['aile tbc'])) conditions.push('Tüberküloz');
            if (parseBoolean(patientData['aile kalp'])) conditions.push('Kalp Hastalığı');
            if (parseBoolean(patientData['aile romatizma'])) conditions.push('Romatizma');
            if (parseBoolean(patientData['aile alerji'])) conditions.push('Alerji');
            if (parseBoolean(patientData['aile kanser'])) conditions.push('Kanser');

            await tx.familyHistory.create({
              data: {
                patientId: patient.id,
                familyIeiHistory: parseBoolean(patientData['aile piy']),
                ieiRelationship: patientData['derecesi'] || null,
                ieiType: conditions.join(', ') || null,
                familyEarlyDeath: parseBoolean(patientData['erken ex']),
                earlyDeathAge: null,
                earlyDeathCause: null,
                earlyDeathRelationship: null,
                otherConditions: conditions.filter(c => c !== 'PIY').join(', ') || null,
              }
            });
          }
        });

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Satır ${i + 1}: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
        console.error(`Error importing patient row ${i + 1}:`, error);
      }
    }

    return NextResponse.json({
      message: `Import tamamlandı: ${results.success} başarılı, ${results.failed} başarısız`,
      results
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Import başarısız', details: error instanceof Error ? error.message : 'Bilinmeyen hata' },
      { status: 500 }
    );
  }
} 