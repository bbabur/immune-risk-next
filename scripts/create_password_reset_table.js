// Create password reset tokens table
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const { Client } = require('pg');
const fs = require('fs');

async function createTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Veritabanına bağlanılıyor...\n');
    await client.connect();
    
    const sql = fs.readFileSync('create-password-reset-table.sql', 'utf8');
    
    console.log('📝 password_reset_tokens tablosu oluşturuluyor...');
    await client.query(sql);
    
    console.log('✅ Tablo başarıyla oluşturuldu!\n');
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await client.end();
  }
}

createTable();

