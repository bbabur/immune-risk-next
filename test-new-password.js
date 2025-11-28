// Test new password
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function testNewPassword() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Veritabanına bağlanılıyor...\n');
    await client.connect();
    
    // Get burak user
    const result = await client.query(
      'SELECT username, email, password FROM users WHERE email = $1',
      ['burakbabursah@gmail.com']
    );
    
    if (result.rows.length === 0) {
      console.log('❌ Kullanıcı bulunamadı!');
      return;
    }
    
    const user = result.rows[0];
    console.log('✅ Kullanıcı bulundu:');
    console.log('   Username:', user.username);
    console.log('   Email:', user.email);
    
    // Test old password
    console.log('\n🔐 Eski şifre testi (909220):');
    const oldPasswordValid = await bcrypt.compare('909220', user.password);
    console.log(oldPasswordValid ? '✅ Eski şifre hala geçerli' : '❌ Eski şifre artık geçersiz');
    
    // Test new password
    console.log('\n🔐 Yeni şifre testi (909223):');
    const newPasswordValid = await bcrypt.compare('909223', user.password);
    console.log(newPasswordValid ? '✅ Yeni şifre geçerli!' : '❌ Yeni şifre geçersiz');
    
    if (newPasswordValid) {
      console.log('\n✅ Şifre başarıyla değiştirilmiş!');
      console.log('Giriş bilgileri:');
      console.log('  Email: burakbabursah@gmail.com');
      console.log('  Şifre: 909223');
    }
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await client.end();
  }
}

testNewPassword();

