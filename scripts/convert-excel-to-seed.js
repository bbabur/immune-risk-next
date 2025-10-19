const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Excel dosyasını oku
// Önce proje root'unda ara, sonra bir üst klasörde ara
let excelPath = path.join(__dirname, '..', 'ANA TABLO.xlsx');
if (!fs.existsSync(excelPath)) {
  excelPath = 'C:\\Users\\Burak Babur\\Desktop\\immune_risk_assessment\\immune-risk-next\\ANA TABLO.xlsx';
}

if (!fs.existsSync(excelPath)) {
  console.error('❌ ANA TABLO.xlsx dosyası bulunamadı!');
  console.log('📁 Beklenen konum:', excelPath);
  process.exit(1);
}

console.log('📖 Excel dosyası okunuyor...');
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`✅ ${data.length} hasta kaydı bulundu\n`);

// İlk 5 hastayı göster
console.log('📋 İlk 5 hasta:');
data.slice(0, 5).forEach((row, i) => {
  console.log(`${i + 1}. ${row['İSİM']} - ${row['CİNSİYET']} - ${row['YAŞ']} ay`);
});

console.log('\n📊 Mevcut kolonlar:');
console.log(Object.keys(data[0]).join(', '));

// Yaş string'ini parse et (örn: "13,5 YAŞ", "2,5 YAŞ", "8 AYLIK")
function parseAge(ageStr) {
  if (!ageStr) return 0;
  
  // String'e çevir ve temizle
  const str = String(ageStr).toUpperCase().trim();
  
  // Sayıyı çıkar (virgülü noktaya çevir)
  const numStr = str.replace(/[^0-9,\.]/g, '').replace(',', '.');
  const num = parseFloat(numStr);
  
  if (isNaN(num)) return 0;
  
  // Eğer "YIL" veya "YAŞINDA" varsa, ay'a çevir
  if (str.includes('YIL') || str.includes('YAŞINDA')) {
    return Math.round(num * 12);
  }
  
  // Ay cinsinden varsay
  return Math.round(num);
}

// Seed formatına çevir
const seedData = data.map((row, index) => {
  // Yaştan doğum tarihini hesapla
  const ageInMonths = parseAge(row['YAŞ']);
  const birthDate = new Date();
  birthDate.setMonth(birthDate.getMonth() - ageInMonths);
  
  // Cinsiyet dönüşümü
  let gender = row['CİNSİYET'];
  if (gender === 0 || gender === '0') gender = 'Erkek';
  else if (gender === 1 || gender === '1') gender = 'Kadın';
  
  return {
    firstName: row['İSİM'] || `Hasta${index + 1}`,
    lastName: row['DOSYA NO'] ? `(Dosya: ${row['DOSYA NO']})` : '',
    birthDate: birthDate.toISOString(),
    gender: gender || 'Bilinmiyor',
    birthWeight: row['DOĞUM KİLOSU'] || null,
    gestationalAge: row['DOĞUM HAFTASI'] || null,
    birthType: row['DOĞUM ŞEKLİ'] || null,
    breastfeedingMonths: row['ANNE SÜTÜ SÜRESİ'] || null,
    hasImmuneDeficiency: true,
    diagnosisType: 'İmmün Yetmezlik',
    // Klinik özellikler
    hasHospitalization: row['HASTANEDE YATTI MI'] ? true : false,
    icuDaysInMonths: row['YATIŞ ZAMANI'] || null,
    // Ek veriler (tüm diğer kolonlar)
    rawData: row
  };
});

// JSON dosyası olarak kaydet
const outputPath = path.join(__dirname, '..', 'prisma', 'patient-seed-data.json');
fs.writeFileSync(outputPath, JSON.stringify(seedData, null, 2), 'utf-8');

console.log(`\n✅ Seed verisi oluşturuldu: ${outputPath}`);
console.log(`📊 Toplam ${seedData.length} hasta kaydı hazırlandı`);

