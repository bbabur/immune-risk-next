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

    // Temel istatistikler
    const patientsCount = await client.query('SELECT COUNT(*) FROM patients');
    const trainingCount = await client.query('SELECT COUNT(*) FROM training_patients');
    const usersCount = await client.query('SELECT COUNT(*) FROM users');

    // Tüm tabloların kayıt sayıları
    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;
    const tablesResult = await client.query(tablesQuery);

    const tableStats = await Promise.all(
      tablesResult.rows.map(async (table) => {
        try {
          const countResult = await client.query(`SELECT COUNT(*) FROM "${table.table_name}"`);
          return {
            name: table.table_name,
            count: parseInt(countResult.rows[0].count)
          };
        } catch (e) {
          return {
            name: table.table_name,
            count: 0
          };
        }
      })
    );

    await client.end();

    return NextResponse.json({
      totalPatients: parseInt(patientsCount.rows[0].count),
      trainingData: parseInt(trainingCount.rows[0].count),
      totalUsers: parseInt(usersCount.rows[0].count),
      tableStats
    });
  } catch (error) {
    console.error('İstatistikler getirilemedi:', error);
    try {
      await client.end();
    } catch (e) {
      // ignore
    }
    return NextResponse.json(
      { error: 'İstatistikler getirilemedi' },
      { status: 500 }
    );
  }
}

