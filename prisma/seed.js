const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Örnek hasta verileri
  const patients = [
    {
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      birthDate: '1980-05-15',
      gender: 'MALE',
      diagnosisType: 'PID',
      diagnosisDate: '2023-01-15',
      height: 175,
      weight: 75,
      ethnicity: 'Turkish'
    },
    {
      firstName: 'Ayşe',
      lastName: 'Demir',
      birthDate: '1995-08-22',
      gender: 'FEMALE',
      diagnosisType: 'CVID',
      diagnosisDate: '2023-03-20',
      height: 165,
      weight: 60,
      ethnicity: 'Turkish'
    },
    {
      firstName: 'Mehmet',
      lastName: 'Kaya',
      birthDate: '1975-12-10',
      gender: 'MALE',
      diagnosisType: 'XLA',
      diagnosisDate: '2023-02-01',
      height: 180,
      weight: 80,
      ethnicity: 'Turkish'
    }
  ];

  for (const patient of patients) {
    await prisma.patient.create({
      data: patient
    });
  }

  console.log('Örnek hasta verileri başarıyla eklendi!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 