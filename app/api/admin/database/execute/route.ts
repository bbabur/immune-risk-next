import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(request: NextRequest) {
  // Admin kontrolü
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { query } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Geçerli bir sorgu gerekli' }, { status: 400 });
    }

    // Tehlikeli komutları engelle
    const dangerousKeywords = ['DROP DATABASE', 'DROP SCHEMA', 'TRUNCATE'];
    const upperQuery = query.toUpperCase();
    
    for (const keyword of dangerousKeywords) {
      if (upperQuery.includes(keyword)) {
        return NextResponse.json(
          { error: `Güvenlik nedeniyle "${keyword}" komutu engellenmiştir` },
          { status: 403 }
        );
      }
    }

    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();
    const result = await client.query(query);
    await client.end();

    return NextResponse.json({
      success: true,
      rows: result.rows,
      rowCount: result.rowCount,
      command: result.command
    });
  } catch (error) {
    console.error('SQL hatası:', error);
    return NextResponse.json(
      { 
        error: 'SQL hatası',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}

