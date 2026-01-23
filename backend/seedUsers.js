require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
const User = require('./models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Clear existing users (optional - comment out if you want to keep existing users)
    // await User.deleteMany({});

    // Create Super Admin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'admin@myplatform.co.tz',
      phone: '0700000001',
      password: 'admin123456',
      role: 'admin',
      verified: true,
      verifiedAt: new Date(),
      isCreator: true,
      creatorType: ['MOVIES', 'SERIES', 'COMEDY', 'GOSPEL', 'MUSIC'],
      wallet: {
        balance: 1000000,
        currency: 'TZS'
      }
    });

    // Create Test Creator
    const creator = await User.create({
      name: 'John Creator',
      email: 'creator@test.com',
      phone: '0712345678',
      password: 'creator123',
      role: 'creator',
      verified: true,
      verifiedAt: new Date(),
      isCreator: true,
      creatorType: ['MOVIES', 'COMEDY'],
      bio: 'Professional content creator specializing in movies and comedy',
      wallet: {
        balance: 50000,
        currency: 'TZS'
      }
    });

    // Create Regular User
    const regularUser = await User.create({
      name: 'Jane User',
      email: 'user@test.com',
      phone: '0723456789',
      password: 'user123456',
      role: 'user',
      verified: false,
      wallet: {
        balance: 0,
        currency: 'TZS'
      }
    });

    // Create Verified User with some balance
    const verifiedUser = await User.create({
      name: 'Mike Verified',
      email: 'verified@test.com',
      phone: '0734567890',
      password: 'verified123',
      role: 'user',
      verified: true,
      verifiedAt: new Date(),
      wallet: {
        balance: 25000,
        currency: 'TZS'
      }
    });

    // Create Gospel Creator
    const gospelCreator = await User.create({
      name: 'Grace Gospel',
      email: 'gospel@test.com',
      phone: '0745678901',
      password: 'gospel123',
      role: 'creator',
      verified: true,
      verifiedAt: new Date(),
      isCreator: true,
      creatorType: ['GOSPEL', 'MUSIC'],
      bio: 'Gospel music artist and content creator',
      wallet: {
        balance: 75000,
        currency: 'TZS'
      }
    });

    console.log('\n✅ Users created successfully!\n');
    console.log('='.repeat(60));
    console.log('LOGIN CREDENTIALS:');
    console.log('='.repeat(60));
    console.log('\n🔐 SUPER ADMIN:');
    console.log('   Email: admin@myplatform.co.tz');
    console.log('   Password: admin123456');
    console.log('   Role: Admin (Full Access)');
    console.log('   Balance: 1,000,000 TZS');
    
    console.log('\n👨‍💼 CREATOR ACCOUNT:');
    console.log('   Email: creator@test.com');
    console.log('   Password: creator123');
    console.log('   Role: Creator (Can upload content)');
    console.log('   Balance: 50,000 TZS');
    
    console.log('\n👤 REGULAR USER:');
    console.log('   Email: user@test.com');
    console.log('   Password: user123456');
    console.log('   Role: User (Not verified)');
    console.log('   Balance: 0 TZS');
    
    console.log('\n✓ VERIFIED USER:');
    console.log('   Email: verified@test.com');
    console.log('   Password: verified123');
    console.log('   Role: User (Verified)');
    console.log('   Balance: 25,000 TZS');
    
    console.log('\n🎵 GOSPEL CREATOR:');
    console.log('   Email: gospel@test.com');
    console.log('   Password: gospel123');
    console.log('   Role: Creator (Gospel & Music)');
    console.log('   Balance: 75,000 TZS');
    
    console.log('\n' + '='.repeat(60));
    console.log('\n✨ All users are ready to use!\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
