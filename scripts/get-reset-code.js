// Get password reset code from database
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const { Client } = require('pg');

async function getResetCode() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Veritabanına bağlanılıyor...\n');
    await client.connect();
    
    // Get latest unused token for burak
    const result = await client.query(`
      SELECT 
        prt.token, 
        prt.created_at, 
        prt.expires_at,
        prt.used,
        u.email
      FROM password_reset_tokens prt
      JOIN users u ON prt.user_id = u.id
      WHERE u.email = $1
      ORDER BY prt.created_at DESC
      LIMIT 1
    `, ['burakbabursah@gmail.com']);
    
    if (result.rows.length === 0) {
      console.log('❌ Kod bulunamadı!');
      console.log('Lütfen forgot-password sayfasından kod isteyin.');
    } else {
      const token = result.rows[0];
      const now = new Date();
      const expiresAt = new Date(token.expires_at);
      const isExpired = now > expiresAt;
      
      console.log('✅ Kod bulundu!\n');
      console.log('📧 Email:', token.email);
      console.log('🔑 KOD:', token.token);
      console.log('📅 Oluşturma:', token.created_at);
      console.log('⏰ Geçerlilik:', token.expires_at);
      console.log('✔️  Kullanıldı mı:', token.used ? 'Evet' : 'Hayır');
      console.log('⚠️  Süresi doldu mu:', isExpired ? 'Evet' : 'Hayır');
      
      if (isExpired) {
        console.log('\n❌ Bu kod süresi dolmuş! Yeni kod isteyin.');
      } else if (token.used) {
        console.log('\n❌ Bu kod zaten kullanılmış! Yeni kod isteyin.');
      } else {
        console.log('\n✅ Bu kodu kullanabilirsiniz!');
      }
    }
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await client.end();
  }
}

getResetCode();

