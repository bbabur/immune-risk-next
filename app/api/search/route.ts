import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim() === '') {
      return NextResponse.json({ patients: [] });
    }

    const searchTerm = query.trim();
    
    // Sadece ad ve soyada göre arama yap
    const patients = await prisma.patient.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: searchTerm
            }
          },
          {
            lastName: {
              contains: searchTerm
            }
          }
        ]
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        gender: true,
        finalRiskLevel: true,
        hasImmuneDeficiency: true,
        diagnosisType: true,
      },
      orderBy: {
        firstName: 'asc'
      },
      take: 20 // Maksimum 20 sonuç
    });

    return NextResponse.json({ patients, count: patients.length });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Arama sırasında hata oluştu' },
      { status: 500 }
    );
  }
} 