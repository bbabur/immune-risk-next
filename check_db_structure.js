const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../immune_risk_assesment/immune_risk.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err);
    return;
  }
  console.log('✅ Connected to SQLite database');
});

// Check table structure
db.serialize(() => {
  // Get table info
  db.all("PRAGMA table_info(patients)", (err, rows) => {
    if (err) {
      console.error('❌ Error getting table info:', err);
      return;
    }
    console.log('📊 Patients table structure:');
    rows.forEach(row => {
      console.log(`   ${row.name}: ${row.type} (${row.notnull ? 'NOT NULL' : 'NULL'})`);
    });
  });

  // Check patient data with basic query
  db.all("SELECT id, first_name, last_name, birth_date FROM patients LIMIT 5", (err, rows) => {
    if (err) {
      console.error('❌ Error reading patients:', err);
      return;
    }
    console.log('\n🔍 Sample patient data:');
    rows.forEach(row => {
      console.log(`   ID: ${row.id}, Name: ${row.first_name} ${row.last_name}, Birth: '${row.birth_date}'`);
    });
  });

  // Check birth_date values specifically
  db.all("SELECT id, birth_date, typeof(birth_date) as type FROM patients WHERE id <= 5", (err, rows) => {
    if (err) {
      console.error('❌ Error checking birth dates:', err);
      return;
    }
    console.log('\n📅 Birth date analysis:');
    rows.forEach(row => {
      console.log(`   ID: ${row.id}, Birth: '${row.birth_date}' (Type: ${row.type})`);
    });
    
    db.close((err) => {
      if (err) {
        console.error('❌ Error closing database:', err);
        return;
      }
      console.log('\n✅ Database connection closed');
    });
  });
}); 