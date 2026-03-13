const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDB() {
  try {
    console.log('🔍 Veritabanı bağlantısı test ediliyor...');
    
    const patientCount = await prisma.patient.count();
    console.log(`✅ Hasta sayısı: ${patientCount}`);
    
    if (patientCount > 0) {
      const patients = await prisma.patient.findMany({
        take: 3,
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      });
      
      console.log('👥 İlk 3 hasta:');
      patients.forEach(p => {
        console.log(`   - ${p.firstName} ${p.lastName} (ID: ${p.id})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testDB(); 