// Test burak user login
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function testLogin() {
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
      'SELECT username, email, password, role FROM users WHERE email = $1',
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
    console.log('   Role:', user.role);
    console.log('   Password hash:', user.password.substring(0, 20) + '...');
    
    // Test password
    console.log('\n🔐 Şifre testi:');
    const testPassword = '909220';
    const isValid = await bcrypt.compare(testPassword, user.password);
    
    if (isValid) {
      console.log('✅ Şifre doğru! "909220" ile giriş yapabilmelisin.');
    } else {
      console.log('❌ Şifre yanlış!');
      console.log('   Denenen şifre:', testPassword);
      console.log('\n💡 Şifreyi yeniden hash\'leyelim mi? (Kayıt sırasında sorun olmuş olabilir)');
    }
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await client.end();
  }
}

testLogin();

