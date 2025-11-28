// .env.local ve .env dosyalarından değişkenleri yükle
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const { Client } = require('pg');

async function checkUsers() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Veritabanına bağlanılıyor...');
    await client.connect();
    
    console.log('📊 Kullanıcılar kontrol ediliyor...\n');
    
    const result = await client.query(`
      SELECT id, username, email, role, is_active, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ Hiç kullanıcı bulunamadı!');
    } else {
      console.log(`✅ Toplam ${result.rows.length} kullanıcı bulundu:\n`);
      result.rows.forEach((user, index) => {
        console.log(`${index + 1}. ${user.username}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Rol: ${user.role}`);
        console.log(`   Aktif: ${user.is_active ? 'Evet' : 'Hayır'}`);
        console.log(`   Oluşturma: ${user.created_at}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await client.end();
  }
}

checkUsers();

