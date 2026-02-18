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

    // Index usage statistics
    const indexUsageQuery = `
      SELECT 
        schemaname,
        relname as table_name,
        indexrelname as index_name,
        idx_scan as index_scans,
        idx_tup_read as tuples_read,
        idx_tup_fetch as tuples_fetched,
        pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
        pg_relation_size(indexrelid) as index_size_bytes
      FROM pg_stat_user_indexes
      ORDER BY idx_scan DESC
    `;
    const indexUsage = await client.query(indexUsageQuery);

    // Unused indexes (potential candidates for removal)
    const unusedIndexesQuery = `
      SELECT 
        schemaname,
        relname as table_name,
        indexrelname as index_name,
        idx_scan as index_scans,
        pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
        pg_relation_size(indexrelid) as index_size_bytes,
        CASE 
          WHEN idx_scan = 0 THEN 'Kullanılmıyor - Silinebilir'
          WHEN idx_scan < 10 THEN 'Nadiren kullanılıyor'
          ELSE 'Aktif'
        END as recommendation
      FROM pg_stat_user_indexes
      WHERE idx_scan < 50
      ORDER BY index_size_bytes DESC
    `;
    const unusedIndexes = await client.query(unusedIndexesQuery);

    // Index bloat estimation (simplified)
    const indexBloatQuery = `
      SELECT
        nspname as schema_name,
        relname as table_name,
        indexrelname as index_name,
        pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
        round(100 * pg_relation_size(indexrelid) / NULLIF(pg_total_relation_size(relid), 0), 2) as index_ratio_pct,
        CASE
          WHEN pg_relation_size(indexrelid) > 10485760 
            AND idx_scan < 100 THEN 'REINDEX önerilir'
          WHEN idx_scan = 0 THEN 'Kullanılmıyor'
          ELSE 'Normal'
        END as status
      FROM pg_stat_user_indexes
      JOIN pg_class ON pg_stat_user_indexes.indexrelid = pg_class.oid
      WHERE pg_relation_size(indexrelid) > 0
      ORDER BY pg_relation_size(indexrelid) DESC
      LIMIT 20
    `;
    const indexBloat = await client.query(indexBloatQuery);

    // Total index size
    const totalSizeQuery = `
      SELECT 
        pg_size_pretty(sum(pg_relation_size(indexrelid))) as total_index_size,
        count(*) as total_indexes
      FROM pg_stat_user_indexes
    `;
    const totalSize = await client.query(totalSizeQuery);

    await client.end();

    return NextResponse.json({
      indexUsage: indexUsage.rows,
      unusedIndexes: unusedIndexes.rows,
      indexHealth: indexBloat.rows,
      summary: totalSize.rows[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Index stats error:', error);
    try { await client.end(); } catch (e) {}
    return NextResponse.json(
      { error: 'Index bilgileri alınamadı', details: String(error) },
      { status: 500 }
    );
  }
}
