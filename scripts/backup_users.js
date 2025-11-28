// Backup all users to JSON file
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function backupUsers() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Veritabanına bağlanılıyor...\n');
    await client.connect();
    
    // Get all users
    const result = await client.query(`
      SELECT id, username, email, role, is_active, created_at, updated_at, last_login
      FROM users
      ORDER BY id
    `);
    
    if (result.rows.length === 0) {
      console.log('⚠️  Hiç kullanıcı bulunamadı!');
      return;
    }

    // Create backups directory if not exists
    const backupDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Create backup file with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `users_backup_${timestamp}.json`;
    const filepath = path.join(backupDir, filename);

    // Write backup
    fs.writeFileSync(filepath, JSON.stringify(result.rows, null, 2));

    console.log('✅ Kullanıcılar yedeklendi!');
    console.log(`📁 Dosya: ${filepath}`);
    console.log(`👥 Toplam: ${result.rows.length} kullanıcı\n`);

    // Show summary
    console.log('📊 Özet:');
    result.rows.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });

  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await client.end();
  }
}

backupUsers();

