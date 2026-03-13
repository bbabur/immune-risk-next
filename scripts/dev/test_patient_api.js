const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPatientAPI() {
  try {
    console.log('🔍 Testing patient API...');
    
    // Test basic patient fetch
    const patient = await prisma.patient.findUnique({
      where: { id: 1 }
    });
    
    if (patient) {
      console.log('✅ Patient found:', {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        birthDate: patient.birthDate,
        gender: patient.gender
      });
    } else {
      console.log('❌ Patient with ID 1 not found');
    }
    
    // Test all patients
    const allPatients = await prisma.patient.findMany({
      take: 5
    });
    
    console.log('📊 Total patients:', allPatients.length);
    allPatients.forEach(p => {
      console.log(`   - ${p.firstName} ${p.lastName} (ID: ${p.id})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPatientAPI(); 