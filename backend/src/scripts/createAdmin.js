const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@sweetshop.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email: admin@sweetshop.com');
      console.log('Username:', existingAdmin.username);
      
      // Update to admin role if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ User updated to admin role');
      }
      
      mongoose.connection.close();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = new User({
      username: 'admin',
      email: 'admin@sweetshop.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('═══════════════════════════════════');
    console.log('📧 Email: admin@sweetshop.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Username: admin');
    console.log('🔐 Role: admin');
    console.log('═══════════════════════════════════');
    console.log('');
    console.log('You can now login with these credentials!');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
}

createAdminUser();
