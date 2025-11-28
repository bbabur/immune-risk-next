const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
// .env.local ve .env dosyalarından değişkenleri yükle
try {
  require('dotenv').config({ path: '.env.local' });
  require('dotenv').config();
} catch (e) {
  // dotenv yoksa veya dosya yoksa sessizce geç
}

async function seedUsers() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ DATABASE_URL tanımlı değil. Lütfen .env /.env.local içinde ayarlayın.');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  console.log('🔌 Veritabanına bağlanılıyor...');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('🔐 Şifreler hashleniyor...');
    const adminPasswordHash = await bcrypt.hash('Admin123456', 10);
    const mehmetPasswordHash = await bcrypt.hash('Mehmet123456', 10);

    console.log('👤 Kullanıcılar ekleniyor/güncelleniyor (UPSERT)...');
    
    // Admin user - UPSERT
    await client.query(
      `
      INSERT INTO users (username, email, password, role, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, 'admin', true, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET
        password = EXCLUDED.password,
        updated_at = NOW()
      `,
      ['admin', 'admin@example.com', adminPasswordHash]
    );

    // Mehmet user - UPSERT
    await client.query(
      `
      INSERT INTO users (username, email, password, role, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, 'admin', true, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET
        password = EXCLUDED.password,
        updated_at = NOW()
      `,
      ['mehmetbabur', 'mehmetbabur@example.com', mehmetPasswordHash]
    );

    await client.query('COMMIT');

    console.log('✅ Kullanıcılar başarıyla oluşturuldu:');
    console.log('   - admin@example.com / Admin123456');
    console.log('   - mehmetbabur@example.com / Mehmet123456');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed sırasında hata:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seedUsers().catch((err) => {
  console.error('❌ Beklenmeyen hata:', err);
  process.exit(1);
});


