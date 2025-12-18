import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - Bildirimleri getir (şimdilik devre dışı)
export async function GET() {
  try {
    // TODO: Implement with pg client when notifications table is ready
    const notifications: any[] = [];
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Bildirimler getirilemedi:', error);
    return NextResponse.json(
      { error: 'Bildirimler getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni bildirim oluştur (şimdilik devre dışı)
export async function POST(request: Request) {
  try {
    const { title, message, type, patientId, category, data } = await request.json();
    
    // TODO: Implement with pg client when notifications table is ready
    console.log('Notification created:', { title, message, type, patientId });
    
    return NextResponse.json({ 
      success: true,
      message: 'Bildirim kaydedildi (log only)' 
    });
  } catch (error) {
    console.error('Bildirim oluşturulamadı:', error);
    return NextResponse.json(
      { error: 'Bildirim oluşturulamadı' },
      { status: 500 }
    );
  }
} 