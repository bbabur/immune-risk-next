import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ImportPatientData {
  // Dynamic interface to handle any column names from CSV
  [key: string]: any;
}

// Helper function to find column value by multiple possible names
function findColumnValue(data: ImportPatientData, possibleNames: string[]): any {
  for (const name of possibleNames) {
    // Try exact match first
    if (data[name] !== undefined && data[name] !== null && data[name] !== '') {
      return data[name];
    }
    
    // Try case-insensitive match
    const lowerName = name.toLowerCase();
    for (const key of Object.keys(data)) {
      if (key.toLowerCase() === lowerName && data[key] !== undefined && data[key] !== null && data[key] !== '') {
        return data[key];
      }
    }
    
    // Try partial match (contains)
    for (const key of Object.keys(data)) {
      if (key.toLowerCase().includes(lowerName) && data[key] !== undefined && data[key] !== null && data[key] !== '') {
        return data[key];
      }
    }
  }
  return undefined;
}

// Evet/Hayır/Var/Yok string'lerini boolean'a çevir
function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  const lower = value.toLowerCase().trim();
  return lower === 'evet' || lower === 'var' || lower === 'yes' || lower === 'true' || lower === '1' || lower === '+';
}

// Yaş ay değerinden doğum tarihini hesapla
function calculateBirthDate(ageInMonths: any): string | null {
  if (!ageInMonths) return null;
  
  // Convert to number and validate
  const ageNum = Number(ageInMonths);
  if (isNaN(ageNum) || ageNum < 0 || ageNum > 1200) { // Max 100 years
    return null;
  }
  
  try {
    const now = new Date();
    const birthDate = new Date(now);
    birthDate.setMonth(birthDate.getMonth() - ageNum);
    return birthDate.toISOString();
  } catch (error) {
    console.error('Error calculating birth date:', error);
    return null;
  }
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
      console.log('\n========== IMPORT DEBUG ==========');
      console.log('Total patients:', patients.length);
      console.log('Available columns:', Object.keys(patients[0]));
      console.log('First patient data:', patients[0]);
      console.log('==================================\n');
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < patients.length; i++) {
      const patientData = patients[i] as ImportPatientData;
      
      try {
        // Use findColumnValue for flexible field mapping
        const firstName = findColumnValue(patientData, [
          'ad', 'Ad', 'ADI', 'adi', 'Adi', 'İsim', 'isim', 
          'first_name', 'firstName', 'hasta_adi', 'hasta_ad',
          'name', 'Name', 'HASTA ADI', 'Hasta Adı'
        ]);
        
        let gender = findColumnValue(patientData, [
          'cins', 'Cins', 'CINS', 'Cinsiyet', 'cinsiyet', 
          'Sex', 'sex', 'gender', 'Gender', 'cinsiyet_bilgisi',
          'CINSIYET', 'Erkek/Kadin', 'E/K', 'CİNSİYET'
        ]);
        
        // Convert numeric gender codes to text
        if (gender === '0' || gender === 0) {
          gender = 'Erkek';
        } else if (gender === '1' || gender === 1) {
          gender = 'Kadın';
        }
        
        const diagnosis = findColumnValue(patientData, [
          'tanı', 'Tanı', 'TANI', 'ana tanı', 'tani_durumu',
          'diagnosis', 'Diagnosis', 'hastalık', 'hastaluk',
          'immune_deficiency', 'piy', 'PIY', 'hasta_durumu'
        ]);
        
        // Calculate birth date from age in months - flexible age mapping
        const ageInMonths = findColumnValue(patientData, [
          'yaş-ay', 'yaş', 'yas', 'yaş_ay', 'yas_ay', 
          'age', 'age_months', 'YAŞ', 'YAS', 'YAŞ-AY'
        ]);
        const birthDate = calculateBirthDate(ageInMonths);

        // Log the first few patients to debug
        if (i < 5) {
          console.log(`\n=== Patient ${i + 1} Debug ===`);
          console.log('Raw age values:', {
            'yaş-ay': patientData['yaş-ay'],
            'yaş': patientData['yaş'], 
            'yas': patientData['yas'],
            'age': patientData['age']
          });
          console.log('Mapped values:', { 
            firstName, 
            gender, 
            ageInMonths,
            ageInMonthsType: typeof ageInMonths,
            birthDate,
            validBirthDate: birthDate !== null
          });
          if (i === 0) {
            console.log('All available keys:', Object.keys(patientData));
          }
        }

        // Validate required fields
        if (!firstName || !gender) {
          results.failed++;
          const availableCols = Object.keys(patientData).slice(0, 10).join(', ');
          results.errors.push(`Satır ${i + 1}: Zorunlu alanlar eksik (ad: '${firstName}', cins: '${gender}') - Kolonlar: ${availableCols}...`);
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
              birthWeight: (() => {
                const val = findColumnValue(patientData, ['doğum kilo', 'dogum_kilo', 'birth_weight', 'doğum_kilo', 'DOĞUM KİLO']);
                return val ? Number(val) : null;
              })(),
              gestationalAge: (() => {
                const val = findColumnValue(patientData, ['doğum hf', 'dogum_hf', 'gestational_age', 'doğum_hf', 'DOĞUM HF']);
                return val ? Number(val) : null;
              })(),
              cordFallDay: (() => {
                const val = findColumnValue(patientData, ['göbek düşme-gün', 'gobek_dusme', 'cord_fall', 'göbek_düşme', 'GÖBEK DÜŞME']);
                return val ? Number(val) : null;
              })(),
              parentalConsanguinity: parseBoolean(findColumnValue(patientData, ['akrabalık', 'akrabalik', 'consanguinity', 'AKRABALIK'])),
              hasImmuneDeficiency: true, // All patients in this CSV are diagnosed with immune deficiency
              diagnosisType: 'İmmün Yetmezlik',
              diagnosisDate: null, // Tarih formatında veri yok
              finalRiskLevel: findColumnValue(patientData, ["4'lü sınıflama", '4lu siniflandirma', 'risk_level', 'final_risk', 'SINIFLANDIRMA']),
            }
          });

          // Add clinical features
          await tx.clinicalFeature.create({
            data: {
              patientId: patient.id,
              growthFailure: parseBoolean(findColumnValue(patientData, ['büyüme', 'buyume', 'growth', 'BÜYÜME'])),
              chronicSkinIssue: parseBoolean(findColumnValue(patientData, ['cilt prob', 'cilt', 'skin', 'CİLT PROB'])),
              chronicDiarrhea: parseBoolean(findColumnValue(patientData, ['ishal', 'diarrhea', 'İSHAL'])),
              bcgLymphadenopathy: parseBoolean(findColumnValue(patientData, ['bcg lap', 'bcg', 'BCG LAP'])),
              persistentThrush: parseBoolean(findColumnValue(patientData, ['pamukçuk', 'pamukcuk', 'thrush', 'PAMUKÇUK'])),
              deepAbscesses: parseBoolean(findColumnValue(patientData, ['abse', 'abscess', 'ABSE'])),
              chd: parseBoolean(findColumnValue(patientData, ['kalp hast', 'kalp', 'heart', 'KALP HAST'])),
            }
          });

          // Add infections data
          const hasInfections = findColumnValue(patientData, ['otit sıklığı/yıl', 'otit', 'OTİT']) || 
                                findColumnValue(patientData, ['sinüzit sıklığı/yıl', 'sinuzit', 'SİNÜZİT']) || 
                                findColumnValue(patientData, ['asye sıklığı/yıl', 'asye', 'ASYE']);
          
          if (hasInfections) {
            await tx.infection.create({
              data: {
                patientId: patient.id,
                type: 'Çoklu enfeksiyon',
                severity: 'Orta',
                treatment: findColumnValue(patientData, ['oral ab', 'oral', 'ORAL AB']) || null,
                antibioticUsed: findColumnValue(patientData, ['oral ab', 'oral', 'ORAL AB']) || null,
                antibioticFailure: false,
                hospitalizationRequired: parseBoolean(findColumnValue(patientData, ['hastane yatış', 'hastane', 'hospitalization', 'HASTANE YATIŞ'])),
              }
            });
          }

          // Add hospitalization data if exists
          const hasHospitalization = parseBoolean(findColumnValue(patientData, ['hastane yatış', 'hastane', 'hospitalization', 'HASTANE YATIŞ']));
          
          if (hasHospitalization) {
            await tx.hospitalization.create({
              data: {
                patientId: patient.id,
                admissionDate: new Date().toISOString(),
                reason: findColumnValue(patientData, ['yatış nedeni', 'yatis nedeni', 'reason', 'YATIŞ NEDENİ']) || 'Bilinmiyor',
                diagnosis: findColumnValue(patientData, ['ana tanı', 'ana tani', 'ANA TANI']) || null,
                icuAdmission: parseBoolean(findColumnValue(patientData, ['ybü', 'ybu', 'icu', 'YBÜ'])),
                icuDays: (() => {
                  const val = findColumnValue(patientData, ['yatış zamanı ay', 'yatis zamani', 'icu_days', 'YATIŞ ZAMANI']);
                  return val ? Number(val) * 30 : null;
                })(),
                ivAntibioticRequirement: parseBoolean(findColumnValue(patientData, ['ıv ab', 'iv ab', 'iv', 'IV AB'])),
                antibioticsUsed: findColumnValue(patientData, ['oral ab', 'oral', 'ORAL AB']) || null,
                notes: null,
              }
            });
          }

          // Add family history
          const ailePiy = parseBoolean(findColumnValue(patientData, ['aile piy', 'aile', 'AİLE PIY']));
          const aileTbc = parseBoolean(findColumnValue(patientData, ['aile tbc', 'AİLE TBC']));
          const aileKalp = parseBoolean(findColumnValue(patientData, ['aile kalp', 'AİLE KALP']));
          const aileRomatizma = parseBoolean(findColumnValue(patientData, ['aile romatizma', 'AİLE ROMATIZMA']));
          const aileAlerji = parseBoolean(findColumnValue(patientData, ['aile alerji', 'AİLE ALERJİ']));
          const aileKanser = parseBoolean(findColumnValue(patientData, ['aile kanser', 'AİLE KANSER']));
          
          const hasAnyFamilyHistory = ailePiy || aileTbc || aileKalp || aileRomatizma || aileAlerji || aileKanser;

          if (hasAnyFamilyHistory) {
            const conditions = [];
            if (ailePiy) conditions.push('PIY');
            if (aileTbc) conditions.push('Tüberküloz');
            if (aileKalp) conditions.push('Kalp Hastalığı');
            if (aileRomatizma) conditions.push('Romatizma');
            if (aileAlerji) conditions.push('Alerji');
            if (aileKanser) conditions.push('Kanser');

            await tx.familyHistory.create({
              data: {
                patientId: patient.id,
                familyIeiHistory: ailePiy,
                ieiRelationship: findColumnValue(patientData, ['derecesi', 'derece', 'relationship', 'DERECESİ']) || null,
                ieiType: conditions.join(', ') || null,
                familyEarlyDeath: parseBoolean(findColumnValue(patientData, ['erken ex', 'erken', 'early_death', 'ERKEN EX'])),
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
        const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
        results.errors.push(`Satır ${i + 1}: ${errorMessage}`);
        console.error(`Error importing patient row ${i + 1}:`, {
          error: errorMessage,
          availableKeys: Object.keys(patientData)
        });
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