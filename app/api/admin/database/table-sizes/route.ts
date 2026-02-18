import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // Table sizes with detailed breakdown
    const tableSizesQuery = `
      SELECT 
        schemaname as schema_name,
        relname as table_name,
        n_live_tup as row_count,
        pg_size_pretty(pg_total_relation_size(relid)) as total_size,
        pg_total_relation_size(relid) as total_size_bytes,
        pg_size_pretty(pg_relation_size(relid)) as table_size,
        pg_relation_size(relid) as table_size_bytes,
        pg_size_pretty(pg_indexes_size(relid)) as index_size,
        pg_indexes_size(relid) as index_size_bytes,
        pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid) - pg_indexes_size(relid)) as toast_size,
        CASE 
          WHEN n_live_tup > 0 THEN pg_relation_size(relid) / n_live_tup
          ELSE 0
        END as avg_row_size_bytes,
        n_dead_tup as dead_tuples,
        CASE 
          WHEN n_live_tup + n_dead_tup > 0 
          THEN round(100.0 * n_dead_tup / (n_live_tup + n_dead_tup), 2)
          ELSE 0 
        END as bloat_ratio
      FROM pg_stat_user_tables
      ORDER BY pg_total_relation_size(relid) DESC
    `;
    const tableSizes = await client.query(tableSizesQuery);

    // Total database size
    const totalQuery = `
      SELECT 
        pg_size_pretty(pg_database_size(current_database())) as total_database_size,
        pg_database_size(current_database()) as total_database_size_bytes,
        pg_size_pretty(sum(pg_total_relation_size(relid))) as total_tables_size,
        sum(pg_total_relation_size(relid)) as total_tables_size_bytes,
        pg_size_pretty(sum(pg_relation_size(relid))) as total_data_size,
        pg_size_pretty(sum(pg_indexes_size(relid))) as total_index_size,
        sum(n_live_tup) as total_rows,
        count(*) as table_count
      FROM pg_stat_user_tables
    `;
    const total = await client.query(totalQuery);

    // Tables needing vacuum
    const vacuumNeededQuery = `
      SELECT 
        schemaname,
        relname as table_name,
        n_dead_tup as dead_tuples,
        n_live_tup as live_tuples,
        round(100.0 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) as dead_ratio,
        last_vacuum,
        last_autovacuum,
        CASE 
          WHEN n_dead_tup > 10000 AND n_dead_tup > n_live_tup * 0.2 THEN 'VACUUM önerilir'
          WHEN n_dead_tup > 1000 THEN 'İzlenmeli'
          ELSE 'Normal'
        END as recommendation
      FROM pg_stat_user_tables
      WHERE n_dead_tup > 100
      ORDER BY n_dead_tup DESC
      LIMIT 10
    `;
    const vacuumNeeded = await client.query(vacuumNeededQuery);

    // Growth estimation (based on dead tuples ratio)
    const growthQuery = `
      SELECT 
        relname as table_name,
        n_live_tup as current_rows,
        pg_size_pretty(pg_total_relation_size(relid)) as current_size,
        CASE 
          WHEN n_live_tup > 0 THEN 
            pg_size_pretty((pg_total_relation_size(relid) / n_live_tup) * (n_live_tup * 2))
          ELSE 'N/A'
        END as estimated_double_size
      FROM pg_stat_user_tables
      WHERE n_live_tup > 100
      ORDER BY pg_total_relation_size(relid) DESC
      LIMIT 10
    `;
    const growth = await client.query(growthQuery);

    await client.end();

    return NextResponse.json({
      tables: tableSizes.rows,
      summary: total.rows[0],
      vacuumNeeded: vacuumNeeded.rows,
      growthEstimates: growth.rows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Table sizes error:', error);
    try { await client.end(); } catch (e) {}
    return NextResponse.json(
      { error: 'Tablo boyut bilgileri alınamadı', details: String(error) },
      { status: 500 }
    );
  }
}
