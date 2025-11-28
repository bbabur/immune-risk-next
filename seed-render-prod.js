// Seed users on Render production
const fetch = require('node-fetch');

async function seedRenderProd() {
  try {
    console.log('🌱 Seeding users on Render production...\n');
    
    const response = await fetch('https://immune-risk-next.onrender.com/api/auth/seed-users', {
      method: 'POST'
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Kullanıcılar Render production\'a eklendi!');
      console.log('\nŞimdi giriş yapabilirsiniz:');
      console.log('  - admin@example.com / Admin123456');
      console.log('  - mehmetbabur@example.com / Mehmet123456');
    } else {
      console.log('\n❌ Seed başarısız:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  }
}

seedRenderProd();

