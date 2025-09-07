import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ImportPatientData {
  // Dynamic interface to handle any column names from CSV
  [key: string]: any;
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
        // Flexible field mapping - support all possible column names
        const firstName = patientData['ad'] || patientData['Ad'] || patientData['ADI'] || patientData['İsim'] || patientData['isim'] || 
                         patientData['first_name'] || patientData['firstName'] || patientData['hasta_adi'] || patientData['hasta_ad'] ||
                         patientData['name'] || patientData['Name'] || patientData['adi'] || patientData['Adi'];
        
        const gender = patientData['cins'] || patientData['Cins'] || patientData['CINS'] || patientData['Cinsiyet'] || patientData['cinsiyet'] || 
                      patientData['Sex'] || patientData['sex'] || patientData['gender'] || patientData['Gender'] || patientData['cinsiyet_bilgisi'] ||
                      patientData['CINSIYET'] || patientData['Erkek/Kadin'] || patientData['E/K'];
        
        const diagnosis = patientData['tanı'] || patientData['Tanı'] || patientData['TANI'] || patientData['ana tanı'] || patientData['tani_durumu'] ||
                         patientData['diagnosis'] || patientData['Diagnosis'] || patientData['hastalık'] || patientData['hastaluk'] ||
                         patientData['immune_deficiency'] || patientData['piy'] || patientData['PIY'] || patientData['hasta_durumu'];
        
        // Calculate birth date from age in months - flexible age mapping
        const ageInMonths = patientData['yaş-ay'] || patientData['yaş'] || patientData['yas'] || 
                           patientData['yaş_ay'] || patientData['yas_ay'] || patientData['age'] || 
                           patientData['age_months'] || patientData['YAŞ'] || patientData['YAS'];
        const birthDate = calculateBirthDate(ageInMonths);

        // Log the first few patients to debug
        if (i < 3) {
          console.log(`Patient ${i + 1} keys:`, Object.keys(patientData));
          console.log(`Patient ${i + 1} mapped:`, { 
            firstName, 
            gender, 
            diagnosis,
            diagnosisParsed: diagnosis ? parseBoolean(diagnosis) : false,
            ageInMonths,
            birthWeight: patientData['doğum kilo'] || patientData['dogum_kilo'] || 'NOT_FOUND',
            gestAge: patientData['doğum hf'] || patientData['dogum_hf'] || 'NOT_FOUND',
            cordFall: patientData['göbek düşme-gün'] || patientData['gobek_dusme'] || 'NOT_FOUND'
          });
        }

        // Validate required fields
        if (!firstName || !gender) {
          results.failed++;
          results.errors.push(`Satır ${i + 1}: Zorunlu alanlar eksik (ad: '${firstName}', cins: '${gender}')`);
          continue;
        }

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
              birthWeight: (patientData['doğum kilo'] || patientData['dogum_kilo'] || patientData['birth_weight'] || patientData['doğum_kilo']) ? 
                          Number(patientData['doğum kilo'] || patientData['dogum_kilo'] || patientData['birth_weight'] || patientData['doğum_kilo']) : null,
              gestationalAge: (patientData['doğum hf'] || patientData['dogum_hf'] || patientData['gestational_age'] || patientData['doğum_hf']) ? 
                             Number(patientData['doğum hf'] || patientData['dogum_hf'] || patientData['gestational_age'] || patientData['doğum_hf']) : null,
              cordFallDay: (patientData['göbek düşme-gün'] || patientData['gobek_dusme'] || patientData['cord_fall'] || patientData['göbek_düşme']) ? 
                          Number(patientData['göbek düşme-gün'] || patientData['gobek_dusme'] || patientData['cord_fall'] || patientData['göbek_düşme']) : null,
              parentalConsanguinity: parseBoolean(patientData['akrabalık']),
              hasImmuneDeficiency: diagnosis ? parseBoolean(diagnosis) : false, // Only if explicitly diagnosed
              diagnosisType: diagnosis && parseBoolean(diagnosis) ? (diagnosis || 'İmmün Yetmezlik') : null,
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