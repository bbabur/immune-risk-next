import { NextResponse } from 'next/server';
import { Client } from 'pg';

// ML assessment için gerekli kolonları ekle
export async function POST() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    const migrations = [
      // ML Değerlendirme Sonuçları için yeni alanlar
      `ALTER TABLE "risk_assessments" ADD COLUMN IF NOT EXISTS "ml_prediction" INTEGER`,
      `ALTER TABLE "risk_assessments" ADD COLUMN IF NOT EXISTS "ml_probability" DOUBLE PRECISION`,
      `ALTER TABLE "risk_assessments" ADD COLUMN IF NOT EXISTS "ml_risk_level" TEXT`,
      `ALTER TABLE "risk_assessments" ADD COLUMN IF NOT EXISTS "ml_features" JSONB`,
    ];

    const results = [];
    
    for (const sql of migrations) {
      try {
        await client.query(sql);
        results.push({ sql: sql.substring(0, 50) + '...', status: 'success' });
      } catch (err: any) {
        results.push({ sql: sql.substring(0, 50) + '...', status: 'error', error: err.message });
      }
    }

    await client.end();

    return NextResponse.json({
      success: true,
      message: 'Migration completed',
      results
    });
  } catch (error) {
    console.error('Migration error:', error);
    try { await client.end(); } catch (e) { /* ignore */ }
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'POST to run ML assessment migrations',
    migrations: [
      'ml_prediction (INTEGER)',
      'ml_probability (DOUBLE PRECISION)',
      'ml_risk_level (TEXT)',
      'ml_features (JSONB)'
    ]
  });
}

