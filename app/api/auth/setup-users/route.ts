import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import * as bcrypt from 'bcryptjs';

const USERS_TO_CREATE = [
  { username: 'burak.babur',   email: 'burak.babur@system.local',   role: 'doctor' },
  { username: 'mehmet.babur',  email: 'mehmet.babur@system.local',  role: 'doctor' },
  { username: 'ismail.reisli', email: 'ismail.reisli@system.local', role: 'doctor' },
];

const DEFAULT_PASSWORD = '12345678';

export async function POST(request: NextRequest) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // must_change_password kolonu yoksa ekle
    await client.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT FALSE
    `);

    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    const results: { username: string; status: string }[] = [];

    for (const u of USERS_TO_CREATE) {
      const existing = await client.query(
        'SELECT id FROM users WHERE username = $1',
        [u.username]
      );

      if (existing.rows.length > 0) {
        // Varsa şifreyi ve must_change_password'ü sıfırla
        await client.query(
          `UPDATE users
           SET password = $1, must_change_password = TRUE, updated_at = NOW()
           WHERE username = $2`,
          [hashedPassword, u.username]
        );
        results.push({ username: u.username, status: 'updated' });
      } else {
        await client.query(
          `INSERT INTO users (username, email, password, role, is_active, must_change_password, created_at, updated_at)
           VALUES ($1, $2, $3, $4, TRUE, TRUE, NOW(), NOW())`,
          [u.username, u.email, hashedPassword, u.role]
        );
        results.push({ username: u.username, status: 'created' });
      }
    }

    await client.end();
    return NextResponse.json({ success: true, results });

  } catch (error) {
    try { await client.end(); } catch { /* ignore */ }
    console.error('setup-users hatası:', error);
    return NextResponse.json(
      { error: 'Kullanıcılar oluşturulamadı', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
