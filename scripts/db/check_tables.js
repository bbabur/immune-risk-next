const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'immune_risk_assesment', 'immune_risk.db');
console.log(`Database path: ${dbPath}`);

try {
  const db = new Database(dbPath, { readonly: true });
  
  // SQLite master tablosundan tablo listesini al
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table';").all();
  
  console.log('\n📋 Tables in database:');
  tables.forEach(table => {
    console.log(`  - ${table.name}`);
  });
  
  // Eğer patients tablosu varsa, içeriğini kontrol et
  if (tables.some(table => table.name === 'patients')) {
    const patientCount = db.prepare("SELECT COUNT(*) as count FROM patients").get();
    console.log(`\n👥 Patient count: ${patientCount.count}`);
    
    // İlk birkaç patient'ı listele
    const patients = db.prepare("SELECT id, first_name, last_name FROM patients LIMIT 5").all();
    console.log('\n📝 First 5 patients:');
    patients.forEach(p => {
      console.log(`  ID: ${p.id}, Name: ${p.first_name} ${p.last_name}`);
    });
  }
  
  db.close();
  
} catch (error) {
  console.error('Error:', error.message);
} 