import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET(request: NextRequest) {
  // Admin kontrolü
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tableName = searchParams.get('table');

  if (!tableName) {
    return NextResponse.json({ error: 'Tablo adı gerekli' }, { status: 400 });
  }

  // SQL injection koruması - sadece alfanumerik ve underscore
  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
    return NextResponse.json({ error: 'Geçersiz tablo adı' }, { status: 400 });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();

    // Kolon bilgilerini al
    const columnsQuery = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position;
    `;
    const columnsResult = await client.query(columnsQuery, [tableName]);

    // Tablo verisini al (ilk 100 kayıt)
    const dataQuery = `SELECT * FROM "${tableName}" LIMIT 100`;
    const dataResult = await client.query(dataQuery);

    await client.end();

    return NextResponse.json({
      columns: columnsResult.rows,
      rows: dataResult.rows
    });
  } catch (error) {
    console.error('Tablo verisi getirilemedi:', error);
    try {
      await client.end();
    } catch (e) {
      // ignore
    }
    return NextResponse.json(
      { error: 'Tablo verisi getirilemedi' },
      { status: 500 }
    );
  }
}

