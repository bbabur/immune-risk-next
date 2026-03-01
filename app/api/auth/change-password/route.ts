import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import * as bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const { username, currentPassword, newPassword } = await request.json();

    if (!username || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Tüm alanlar zorunludur' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Yeni şifre en az 8 karakter olmalıdır' },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'Yeni şifre eski şifreden farklı olmalıdır' },
        { status: 400 }
      );
    }

    await client.connect();

    const result = await client.query(
      'SELECT id, password FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      await client.end();
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      await client.end();
      return NextResponse.json({ error: 'Mevcut şifre hatalı' }, { status: 401 });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);

    await client.query(
      `UPDATE users
       SET password = $1, must_change_password = FALSE, updated_at = NOW()
       WHERE id = $2`,
      [hashedNew, user.id]
    );

    await client.end();
    return NextResponse.json({ success: true, message: 'Şifre başarıyla değiştirildi' });

  } catch (error) {
    try { await client.end(); } catch { /* ignore */ }
    console.error('change-password hatası:', error);
    return NextResponse.json(
      { error: 'Şifre değiştirilemedi', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
