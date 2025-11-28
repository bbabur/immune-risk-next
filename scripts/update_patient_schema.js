// Update patient schema in database
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const { Client } = require('pg');
const fs = require('fs');

async function updateSchema() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Veritabanına bağlanılıyor...\n');
    await client.connect();
    
    const sql = fs.readFileSync('update-patient-schema.sql', 'utf8');
    
    console.log('📝 Patient tablosu güncelleniyor...');
    await client.query(sql);
    
    console.log('✅ Tablo başarıyla güncellendi!\n');
    
    // Verify changes
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'patients' 
      ORDER BY ordinal_position
    `);
    
    console.log('📋 Güncel tablo yapısı:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await client.end();
  }
}

updateSchema();

