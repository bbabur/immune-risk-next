import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET(request: NextRequest) {
  // Admin kontrolü
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();

    // Tüm tabloları ve kayıt sayılarını getir
    const query = `
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM information_schema.tables t2 WHERE t2.table_name = t.table_name) as row_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;

    const result = await client.query(query);
    
    // Her tablo için gerçek kayıt sayısını al
    const tablesWithCounts = await Promise.all(
      result.rows.map(async (table) => {
        try {
          const countResult = await client.query(`SELECT COUNT(*) FROM "${table.table_name}"`);
          return {
            table_name: table.table_name,
            row_count: parseInt(countResult.rows[0].count)
          };
        } catch (e) {
          return {
            table_name: table.table_name,
            row_count: 0
          };
        }
      })
    );

    await client.end();

    return NextResponse.json({ tables: tablesWithCounts });
  } catch (error) {
    console.error('Tablolar getirilemedi:', error);
    try {
      await client.end();
    } catch (e) {
      // ignore
    }
    return NextResponse.json(
      { error: 'Tablolar getirilemedi' },
      { status: 500 }
    );
  }
}

