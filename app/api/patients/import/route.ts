import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ImportPatientData {
  // Excel başlıklarına uygun şekilde düzenlendi
  'Hasta No'?: string;
  'Ad'?: string;
  'Soyad'?: string;
  'Doğum Tarihi'?: string;
  'Cinsiyet'?: string;
  'Boy (cm)'?: number;
  'Kilo (kg)'?: number;
  'Etnik Köken'?: string;
  'Doğum Ağırlığı (gr)'?: number;
  'Gestasyonel Yaş (hafta)'?: number;
  'Kordon Düşme Günü'?: number;
  'Anne Baba Akrabalığı'?: string;
  'İmmün Yetmezlik Tanısı'?: string;
  'Tanı Türü'?: string;
  'Tanı Tarihi'?: string;
  'Nihai Risk Seviyesi'?: string;
  // Klinik özellikler
  'Büyüme Geriliği'?: string;
  'Kronik Cilt Sorunu'?: string;
  'Kronik İshal'?: string;
  'BCG Lenfadenopati'?: string;
  'Kalıcı Pamukçuk'?: string;
  'Derin Apseler'?: string;
  'Konjenital Kalp Hastalığı'?: string;
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

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 0; i < patients.length; i++) {
      const patientData = patients[i] as ImportPatientData;
      
      try {
        // Validate required fields
        if (!patientData.birthDate || !patientData.gender) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: Missing required fields (birthDate, gender)`);
          continue;
        }

        // Create patient with transaction
        await prisma.$transaction(async (tx) => {
          const patient = await tx.patient.create({
            data: {
              firstName: patientData.firstName || '',
              lastName: patientData.lastName || '',
              birthDate: patientData.birthDate,
              gender: patientData.gender,
              height: patientData.height,
              weight: patientData.weight,
              ethnicity: patientData.ethnicity,
              birthWeight: patientData.birthWeight,
              gestationalAge: patientData.gestationalAge,
              cordFallDay: patientData.cordFallDay,
              parentalConsanguinity: patientData.parentalConsanguinity || false,
              hasImmuneDeficiency: patientData.hasImmuneDeficiency,
              diagnosisType: patientData.diagnosisType,
              diagnosisDate: patientData.diagnosisDate,
              finalRiskLevel: patientData.finalRiskLevel,
            }
          });

          // Add clinical features if provided
          if (patientData.growthFailure !== undefined || 
              patientData.chronicSkinIssue !== undefined ||
              patientData.chronicDiarrhea !== undefined ||
              patientData.bcgLymphadenopathy !== undefined ||
              patientData.persistentThrush !== undefined ||
              patientData.deepAbscesses !== undefined ||
              patientData.chd !== undefined) {
            
            await tx.clinicalFeature.create({
              data: {
                patientId: patient.id,
                growthFailure: patientData.growthFailure || false,
                chronicSkinIssue: patientData.chronicSkinIssue || false,
                chronicDiarrhea: patientData.chronicDiarrhea || false,
                bcgLymphadenopathy: patientData.bcgLymphadenopathy || false,
                persistentThrush: patientData.persistentThrush || false,
                deepAbscesses: patientData.deepAbscesses || false,
                chd: patientData.chd || false,
              }
            });
          }
        });

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error(`Error importing patient row ${i + 1}:`, error);
      }
    }

    return NextResponse.json({
      message: `Import completed: ${results.success} successful, ${results.failed} failed`,
      results
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Import failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 