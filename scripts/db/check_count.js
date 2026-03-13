const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkCount() {
  try {
    const totalCount = await prisma.patient.count();
    const diagnosedCount = await prisma.patient.count({
      where: {
        hasImmuneDeficiency: true
      }
    });
    
    console.log('📊 Hasta İstatistikleri:');
    console.log(`   - Toplam hasta: ${totalCount}`);
    console.log(`   - Tanı konulmuş: ${diagnosedCount}`);
    console.log(`   - Tanı konulmamış: ${totalCount - diagnosedCount}`);
    
    // Son 5 hastayı göster
    const patients = await prisma.patient.findMany({
      take: 5,
      orderBy: { id: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        hasImmuneDeficiency: true
      }
    });
    
    console.log('\n🏥 Son eklenen 5 hasta:');
    patients.forEach(p => {
      console.log(`   ${p.id}. ${p.firstName} ${p.lastName} - ${p.hasImmuneDeficiency ? 'Tanı var' : 'Tanı yok'}`);
    });
    
  } catch (error) {
    console.error('Hata:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkCount(); 