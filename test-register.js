// Test register endpoint
const fetch = require('node-fetch');

async function testRegister() {
  try {
    console.log('Testing /api/auth/register endpoint...\n');
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser123',
        email: 'testuser123@test.com',
        password: '123456',
        role: 'user'
      })
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Register endpoint çalışıyor!');
    } else {
      console.log('\n❌ Register başarısız:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Hata:', error.message);
  }
}

testRegister();

