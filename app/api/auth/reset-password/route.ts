import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import * as bcrypt from 'bcryptjs';
import { sanitizeString, validatePassword } from '@/lib/validation';

export async function POST(request: NextRequest) {
  console.log('Reset password API called');
  
  try {
    const { code, newPassword } = await request.json();

    if (!code || !newPassword) {
      return NextResponse.json(
        { error: 'Kod ve yeni şifre gerekli' },
        { status: 400 }
      );
    }

    const sanitizedCode = sanitizeString(code.trim());

    if (sanitizedCode.length !== 6) {
      return NextResponse.json(
        { error: 'Geçersiz kod formatı' },
        { status: 400 }
      );
    }

    if (!validatePassword(newPassword)) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalıdır' },
        { status: 400 }
      );
    }

    console.log('Connecting to database...');
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();

    // Find valid token
    const tokenResult = await client.query(
      `SELECT id, user_id, expires_at, used 
       FROM password_reset_tokens 
       WHERE token = $1`,
      [sanitizedCode]
    );

    if (tokenResult.rows.length === 0) {
      await client.end();
      return NextResponse.json(
        { error: 'Geçersiz kod' },
        { status: 400 }
      );
    }

    const token = tokenResult.rows[0];

    // Check if already used
    if (token.used) {
      await client.end();
      return NextResponse.json(
        { error: 'Bu kod zaten kullanılmış' },
        { status: 400 }
      );
    }

    // Check if expired
    if (new Date() > new Date(token.expires_at)) {
      await client.end();
      return NextResponse.json(
        { error: 'Kod süresi dolmuş. Lütfen yeni kod isteyin.' },
        { status: 400 }
      );
    }

    console.log('Hashing new password...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log('Updating password...');
    // Update password
    await client.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, token.user_id]
    );

    // Mark token as used
    await client.query(
      'UPDATE password_reset_tokens SET used = true WHERE id = $1',
      [token.id]
    );

    await client.end();

    console.log('Password reset successful');

    return NextResponse.json({
      success: true,
      message: 'Şifreniz başarıyla değiştirildi. Şimdi giriş yapabilirsiniz.'
    });

  } catch (error) {
    console.error('Reset password hatası:', error);
    return NextResponse.json(
      { 
        error: 'Şifre sıfırlama başarısız',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}

