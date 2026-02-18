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

    // Long running queries (active for more than 5 seconds)
    const longRunningQuery = `
      SELECT 
        pid,
        usename as username,
        application_name,
        client_addr,
        state,
        EXTRACT(EPOCH FROM (now() - query_start)) as duration_seconds,
        wait_event_type,
        wait_event,
        LEFT(query, 1000) as query_text,
        query_start,
        state_change
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND state = 'active'
        AND query_start < now() - interval '5 seconds'
        AND pid != pg_backend_pid()
      ORDER BY query_start ASC
    `;
    const longRunning = await client.query(longRunningQuery);

    // Query statistics (if pg_stat_statements is enabled)
    let queryStats: any[] = [];
    try {
      const queryStatsQuery = `
        SELECT 
          LEFT(query, 500) as query_text,
          calls,
          total_exec_time as total_time_ms,
          mean_exec_time as avg_time_ms,
          rows,
          shared_blks_hit,
          shared_blks_read,
          CASE WHEN shared_blks_hit + shared_blks_read > 0 
            THEN round(100.0 * shared_blks_hit / (shared_blks_hit + shared_blks_read), 2)
            ELSE 0 
          END as cache_hit_ratio
        FROM pg_stat_statements
        WHERE dbid = (SELECT oid FROM pg_database WHERE datname = current_database())
        ORDER BY total_exec_time DESC
        LIMIT 20
      `;
      const stats = await client.query(queryStatsQuery);
      queryStats = stats.rows;
    } catch (e) {
      // pg_stat_statements extension may not be installed
      queryStats = [];
    }

    // Recent slow queries from pg_stat_activity (idle queries that took long)
    const recentSlowQuery = `
      SELECT 
        pid,
        usename as username,
        state,
        EXTRACT(EPOCH FROM (state_change - query_start)) as execution_time_seconds,
        LEFT(query, 500) as query_text,
        query_start,
        state_change
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND state = 'idle'
        AND query NOT LIKE '%pg_stat_activity%'
        AND query NOT LIKE 'SET %'
        AND state_change > now() - interval '1 hour'
      ORDER BY (state_change - query_start) DESC
      LIMIT 20
    `;
    const recentSlow = await client.query(recentSlowQuery);

    // Summary
    const summaryQuery = `
      SELECT 
        count(*) FILTER (WHERE state = 'active') as active_queries,
        count(*) FILTER (WHERE state = 'active' AND query_start < now() - interval '30 seconds') as long_running_30s,
        count(*) FILTER (WHERE state = 'active' AND query_start < now() - interval '60 seconds') as long_running_60s,
        max(EXTRACT(EPOCH FROM (now() - query_start))) FILTER (WHERE state = 'active') as longest_running_seconds
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND pid != pg_backend_pid()
    `;
    const summary = await client.query(summaryQuery);

    await client.end();

    return NextResponse.json({
      longRunning: longRunning.rows,
      queryStats: queryStats,
      recentSlow: recentSlow.rows,
      summary: summary.rows[0],
      hasStatStatements: queryStats.length > 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Queries error:', error);
    try { await client.end(); } catch (e) {}
    return NextResponse.json(
      { error: 'Sorgu bilgileri alınamadı', details: String(error) },
      { status: 500 }
    );
  }
}
