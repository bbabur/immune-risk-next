import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import { sanitizeString, validateEmail, checkRateLimit } from '@/lib/validation';
import { sendPasswordResetEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  console.log('Forgot password API called');
  
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email adresi gerekli' },
        { status: 400 }
      );
    }

    const sanitizedEmail = sanitizeString(email.trim().toLowerCase());

    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Geçerli bir email adresi giriniz' },
        { status: 400 }
      );
    }

    // Rate limiting - max 3 attempts per 15 minutes
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`forgot-password:${clientIp}`, 3, 900000)) {
      return NextResponse.json(
        { error: 'Çok fazla istek. Lütfen 15 dakika bekleyin.' },
        { status: 429 }
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

    // Check if user exists
    const userResult = await client.query(
      'SELECT id, email, username FROM users WHERE email = $1 AND is_active = true',
      [sanitizedEmail]
    );

    if (userResult.rows.length === 0) {
      await client.end();
      // Güvenlik için: Email bulunamasa bile başarılı mesajı dön
      return NextResponse.json({
        success: true,
        message: 'Eğer bu email kayıtlıysa, şifre sıfırlama kodu gönderildi.'
      });
    }

    const user = userResult.rows[0];

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 dakika

    console.log('Creating reset token...');
    
    // Delete old unused tokens for this user
    await client.query(
      'DELETE FROM password_reset_tokens WHERE user_id = $1 AND used = false',
      [user.id]
    );

    // Create new token
    await client.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [user.id, code, expiresAt]
    );

    await client.end();

    // Send email
    console.log('Sending reset code email...');
    const emailSent = await sendPasswordResetEmail(user.email, code);

    if (!emailSent) {
      console.error('Email gönderilemedi');
    }

    return NextResponse.json({
      success: true,
      message: 'Şifre sıfırlama kodu email adresinize gönderildi.'
    });

  } catch (error) {
    console.error('Forgot password hatası:', error);
    return NextResponse.json(
      { 
        error: 'Şifre sıfırlama isteği başarısız',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    );
  }
}

