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

    // Database general info
    const dbInfoQuery = `
      SELECT 
        current_database() as database_name,
        pg_size_pretty(pg_database_size(current_database())) as database_size,
        pg_database_size(current_database()) as database_size_bytes,
        (SELECT setting FROM pg_settings WHERE name = 'server_version') as pg_version,
        (SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()) as active_connections,
        (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_connections,
        current_timestamp as server_time,
        (SELECT pg_postmaster_start_time()) as server_start_time
    `;
    const dbInfo = await client.query(dbInfoQuery);

    // Last vacuum and analyze
    const maintenanceQuery = `
      SELECT 
        schemaname,
        relname as table_name,
        last_vacuum,
        last_autovacuum,
        last_analyze,
        last_autoanalyze,
        n_live_tup as live_tuples,
        n_dead_tup as dead_tuples
      FROM pg_stat_user_tables
      ORDER BY n_dead_tup DESC
      LIMIT 10
    `;
    const maintenance = await client.query(maintenanceQuery);

    // Cache hit ratio
    const cacheQuery = `
      SELECT 
        sum(heap_blks_read) as heap_read,
        sum(heap_blks_hit) as heap_hit,
        CASE WHEN sum(heap_blks_hit) + sum(heap_blks_read) > 0 
          THEN round(sum(heap_blks_hit)::numeric / (sum(heap_blks_hit) + sum(heap_blks_read)) * 100, 2)
          ELSE 0 
        END as cache_hit_ratio
      FROM pg_statio_user_tables
    `;
    const cache = await client.query(cacheQuery);

    // Connection stats
    const connectionStatsQuery = `
      SELECT 
        state,
        count(*) as count
      FROM pg_stat_activity
      WHERE datname = current_database()
      GROUP BY state
    `;
    const connectionStats = await client.query(connectionStatsQuery);

    // Database uptime
    const uptimeQuery = `
      SELECT 
        now() - pg_postmaster_start_time() as uptime,
        EXTRACT(EPOCH FROM (now() - pg_postmaster_start_time())) as uptime_seconds
    `;
    const uptime = await client.query(uptimeQuery);

    await client.end();

    return NextResponse.json({
      database: dbInfo.rows[0],
      maintenance: maintenance.rows,
      cache: cache.rows[0],
      connectionStats: connectionStats.rows,
      uptime: uptime.rows[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database overview error:', error);
    try { await client.end(); } catch (e) {}
    return NextResponse.json(
      { error: 'Veritabanı bilgileri alınamadı', details: String(error) },
      { status: 500 }
    );
  }
}
