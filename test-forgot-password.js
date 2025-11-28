// Test forgot password endpoint
const fetch = require('node-fetch');

async function testForgotPassword() {
  try {
    console.log('Testing forgot password...\n');
    
    const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'burakbabursah@gmail.com'
      })
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Kod gönderildi!');
      console.log('⚠️  Dev server terminalinde kodu kontrol et');
    } else {
      console.log('\n❌ Hata:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Bağlantı hatası:', error.message);
  }
}

testForgotPassword();

