import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Anti-HBs referans değerlerini getir
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ageMonths = searchParams.get('ageMonths');
    const isBooster = searchParams.get('isBooster') === 'true';

    // Eğer yaş belirtilmişse, o yaşa uygun referansı getir
    if (ageMonths) {
      const age = parseInt(ageMonths);
      const reference = await prisma.antiHbsReference.findFirst({
        where: {
          minAgeMonths: { lte: age },
          OR: [
            { maxAgeMonths: { gte: age } },
            { maxAgeMonths: null }
          ],
          isBoosterResponse: isBooster
        }
      });

      if (!reference) {
        return NextResponse.json(
          { error: 'Bu yaş için referans bulunamadı' },
          { status: 404 }
        );
      }

      return NextResponse.json(reference);
    }

    // Tüm referansları getir
    const references = await prisma.antiHbsReference.findMany({
      orderBy: [
        { isBoosterResponse: 'asc' },
        { minAgeMonths: 'asc' }
      ]
    });

    return NextResponse.json(references);
  } catch (error) {
    console.error('Anti-HBs referans getirme hatası:', error);
    return NextResponse.json(
      { error: 'Veri getirme başarısız' },
      { status: 500 }
    );
  }
}

// POST - Yeni Anti-HBs referans değeri ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const reference = await prisma.antiHbsReference.create({
      data: body
    });

    return NextResponse.json(reference, { status: 201 });
  } catch (error) {
    console.error('Anti-HBs referans ekleme hatası:', error);
    return NextResponse.json(
      { error: 'Veri ekleme başarısız' },
      { status: 500 }
    );
  }
}

// DELETE - Devre dışı bırakıldı (veri kaybını önlemek için)
export async function DELETE() {
  return NextResponse.json(
    { error: 'Toplu silme işlemi güvenlik nedeniyle devre dışı bırakıldı' },
    { status: 403 }
  );
}

