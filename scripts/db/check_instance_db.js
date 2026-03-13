const Database = require('better-sqlite3');
const path = require('path');

// İki farklı veritabanını kontrol et
const dbPaths = [
  path.join(__dirname, 'immune_risk_assesment', 'instance', 'immune_risk.db'),
  path.join(__dirname, 'immune_risk_assesment', 'instance', 'immune_risk_assessment.db')
];

dbPaths.forEach((dbPath, index) => {
  console.log(`\n=== Database ${index + 1}: ${path.basename(dbPath)} ===`);
  console.log(`Path: ${dbPath}`);
  
  try {
    const db = new Database(dbPath, { readonly: true });
    
    // Tabloları listele
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table';").all();
    console.log('\n📋 Tables:');
    tables.forEach(table => {
      console.log(`  - ${table.name}`);
    });
    
    // Eğer patients tablosu varsa, içeriğini kontrol et
    if (tables.some(table => table.name === 'patients')) {
      const patientCount = db.prepare("SELECT COUNT(*) as count FROM patients").get();
      console.log(`\n👥 Patient count: ${patientCount.count}`);
      
      if (patientCount.count > 0) {
        const patients = db.prepare("SELECT id, first_name, last_name FROM patients LIMIT 5").all();
        console.log('\n📝 First 5 patients:');
        patients.forEach(p => {
          console.log(`  ID: ${p.id}, Name: ${p.first_name} ${p.last_name}`);
        });
      }
    }
    
    db.close();
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}); 