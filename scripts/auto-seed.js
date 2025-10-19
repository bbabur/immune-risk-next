// Auto-seed script that runs after deployment
const fetch = require('node-fetch');

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function autoSeed() {
  console.log('🌱 Starting auto-seed process...');

  try {
    // 1. Seed Users
    console.log('👥 Seeding users...');
    const usersResponse = await fetch(`${baseUrl}/api/auth/seed-users`, {
      method: 'POST',
    });
    const usersData = await usersResponse.json();
    console.log('✅ Users seeded:', usersData);

    // 2. Check if training data exists
    console.log('📊 Checking training data...');
    const trainingCheckResponse = await fetch(`${baseUrl}/api/training-data`);
    const trainingData = await trainingCheckResponse.json();
    
    if (trainingData.length === 0) {
      console.log('📥 Training data empty, seeding...');
      const trainingSeedResponse = await fetch(`${baseUrl}/api/training-data/seed`, {
        method: 'POST',
      });
      const trainingSeedData = await trainingSeedResponse.json();
      console.log('✅ Training data seeded:', trainingSeedData);
    } else {
      console.log(`ℹ️ Training data already exists (${trainingData.length} records), skipping seed`);
    }

    console.log('🎉 Auto-seed completed successfully!');
  } catch (error) {
    console.error('❌ Auto-seed failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  autoSeed();
}

module.exports = { autoSeed };

