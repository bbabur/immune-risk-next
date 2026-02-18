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

    // Active sessions
    const activeSessionsQuery = `
      SELECT 
        pid,
        usename as username,
        application_name,
        client_addr,
        client_port,
        backend_start,
        state,
        state_change,
        wait_event_type,
        wait_event,
        EXTRACT(EPOCH FROM (now() - backend_start)) as connection_duration_seconds,
        EXTRACT(EPOCH FROM (now() - state_change)) as state_duration_seconds,
        LEFT(query, 500) as query_preview
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND pid != pg_backend_pid()
      ORDER BY backend_start DESC
    `;
    const activeSessions = await client.query(activeSessionsQuery);

    // Blocking sessions
    const blockingQuery = `
      SELECT 
        blocked.pid as blocked_pid,
        blocked.usename as blocked_user,
        blocking.pid as blocking_pid,
        blocking.usename as blocking_user,
        blocked.wait_event_type,
        blocked.wait_event,
        EXTRACT(EPOCH FROM (now() - blocked.state_change)) as wait_duration_seconds,
        LEFT(blocked.query, 300) as blocked_query,
        LEFT(blocking.query, 300) as blocking_query
      FROM pg_stat_activity blocked
      JOIN pg_stat_activity blocking ON blocking.pid = ANY(pg_blocking_pids(blocked.pid))
      WHERE blocked.datname = current_database()
    `;
    const blockingSessions = await client.query(blockingQuery);

    // Lock statistics
    const locksQuery = `
      SELECT 
        locktype,
        mode,
        count(*) as lock_count
      FROM pg_locks
      WHERE database = (SELECT oid FROM pg_database WHERE datname = current_database())
      GROUP BY locktype, mode
      ORDER BY lock_count DESC
    `;
    const locks = await client.query(locksQuery);

    // Session summary
    const summaryQuery = `
      SELECT 
        count(*) as total_sessions,
        count(*) FILTER (WHERE state = 'active') as active,
        count(*) FILTER (WHERE state = 'idle') as idle,
        count(*) FILTER (WHERE state = 'idle in transaction') as idle_in_transaction,
        count(*) FILTER (WHERE wait_event_type IS NOT NULL) as waiting
      FROM pg_stat_activity
      WHERE datname = current_database()
    `;
    const summary = await client.query(summaryQuery);

    await client.end();

    return NextResponse.json({
      sessions: activeSessions.rows,
      blocking: blockingSessions.rows,
      locks: locks.rows,
      summary: summary.rows[0],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sessions error:', error);
    try { await client.end(); } catch (e) {}
    return NextResponse.json(
      { error: 'Session bilgileri alınamadı', details: String(error) },
      { status: 500 }
    );
  }
}

// Kill session (requires DbAdmin_Super role)
export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Feature flag check
  const enableWriteOps = process.env.ENABLE_DB_ADMIN_WRITE === 'true';
  if (!enableWriteOps) {
    return NextResponse.json(
      { error: 'Write operations are disabled. Set ENABLE_DB_ADMIN_WRITE=true' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const pid = searchParams.get('pid');

  if (!pid || isNaN(parseInt(pid))) {
    return NextResponse.json({ error: 'Valid PID required' }, { status: 400 });
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();

    // Terminate the session
    const result = await client.query(
      'SELECT pg_terminate_backend($1) as terminated',
      [parseInt(pid)]
    );

    // Log the action (audit)
    await client.query(`
      INSERT INTO notifications (title, message, type, category, data, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    `, [
      'Session Terminated',
      `PID ${pid} terminated by admin`,
      'warning',
      'db_admin',
      JSON.stringify({ pid, action: 'kill_session', timestamp: new Date().toISOString() })
    ]);

    await client.end();

    return NextResponse.json({
      success: result.rows[0].terminated,
      message: result.rows[0].terminated 
        ? `Session ${pid} terminated successfully` 
        : `Session ${pid} could not be terminated`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Kill session error:', error);
    try { await client.end(); } catch (e) {}
    return NextResponse.json(
      { error: 'Session sonlandırılamadı', details: String(error) },
      { status: 500 }
    );
  }
}
