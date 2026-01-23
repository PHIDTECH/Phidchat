// This script adds demo users and posts to the in-memory database
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const demoUsers = [
  { name: 'John Doe', email: 'john@demo.com', phone: '0712345001', password: 'demo123' },
  { name: 'Jane Smith', email: 'jane@demo.com', phone: '0712345002', password: 'demo123' },
  { name: 'Mike Johnson', email: 'mike@demo.com', phone: '0712345003', password: 'demo123' },
  { name: 'Sarah Williams', email: 'sarah@demo.com', phone: '0712345004', password: 'demo123' },
  { name: 'David Brown', email: 'david@demo.com', phone: '0712345005', password: 'demo123' },
  { name: 'Emma Davis', email: 'emma@demo.com', phone: '0712345006', password: 'demo123' },
  { name: 'James Wilson', email: 'james@demo.com', phone: '0712345007', password: 'demo123' },
  { name: 'Olivia Taylor', email: 'olivia@demo.com', phone: '0712345008', password: 'demo123' },
];

const demoPosts = [
  "Just joined PhidChat! Excited to connect with everyone! 🎉",
  "Beautiful day in Dar es Salaam! ☀️",
  "Who's watching the game tonight? 🏆",
  "Just finished an amazing project! Feeling accomplished 💪",
  "Coffee time! ☕ What's everyone up to?",
  "Happy Friday everyone! Weekend plans? 🎊",
  "New music video dropping soon! Stay tuned 🎵",
  "Grateful for all the support from this community ❤️",
];

async function seedData() {
  console.log('🌱 Seeding demo data...\n');
  
  const tokens = [];
  
  // Register demo users
  console.log('👥 Creating demo users...');
  for (const user of demoUsers) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, user);
      tokens.push(response.data.token);
      console.log(`✅ Created: ${user.name}`);
    } catch (error) {
      console.log(`⚠️  ${user.name} might already exist`);
    }
  }
  
  // Create some posts
  console.log('\n📝 Creating demo posts...');
  for (let i = 0; i < Math.min(tokens.length, demoPosts.length); i++) {
    try {
      await axios.post(`${API_URL}/posts`, {
        content: { text: demoPosts[i] },
        visibility: 'public'
      }, {
        headers: { Authorization: `Bearer ${tokens[i]}` }
      });
      console.log(`✅ Post created by ${demoUsers[i].name}`);
    } catch (error) {
      console.log(`⚠️  Could not create post for ${demoUsers[i].name}`);
    }
  }
  
  console.log('\n✨ Demo data seeded successfully!\n');
  console.log('📋 Demo User Credentials:');
  console.log('─'.repeat(50));
  demoUsers.forEach(user => {
    console.log(`Email: ${user.email} | Password: demo123`);
  });
  console.log('─'.repeat(50));
  console.log('\n🚀 You can now login with any of these accounts!\n');
}

seedData().catch(console.error);
