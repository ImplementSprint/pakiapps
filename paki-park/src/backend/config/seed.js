/**
 * Database Seed Script
 * Run: npm run seed
 * Seeds the database with initial data for development
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Location = require('../models/Location');
const ParkingRate = require('../models/ParkingRate');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pakipark');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Location.deleteMany({});
    await ParkingRate.deleteMany({});

    // Seed admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    await User.create({
      name: 'PakiPark Admin',
      email: 'admin@pakipark.com',
      password: hashedPassword,
      phone: '9123456789',
      role: 'admin',
      isVerified: true,
    });

    // Seed locations
    await Location.insertMany([
      { name: 'Ayala Center', address: 'Makati Central Business District', lat: 14.5547, lng: 121.0244, totalSpots: 120, availableSpots: 45, hourlyRate: 50, status: 'active' },
      { name: 'Robinsons Galleria', address: 'EDSA cor. Ortigas Avenue, Quezon City', lat: 14.5879, lng: 121.0594, totalSpots: 200, availableSpots: 78, hourlyRate: 50, status: 'active' },
      { name: 'SM North EDSA', address: 'North Avenue cor. EDSA, Quezon City', lat: 14.6570, lng: 121.0295, totalSpots: 300, availableSpots: 120, hourlyRate: 50, status: 'active' },
      { name: 'SM San Lazaro', address: 'Felix Huertas cor. A.H. Lacson St., Manila', lat: 14.6163, lng: 120.9825, totalSpots: 150, availableSpots: 65, hourlyRate: 50, status: 'active' },
      { name: 'SM Mall of Asia (MOA)', address: 'Seaside Blvd, Pasay City', lat: 14.5351, lng: 120.9826, totalSpots: 500, availableSpots: 210, hourlyRate: 60, status: 'active' },
    ]);

    // Seed parking rates
    await ParkingRate.insertMany([
      { vehicleType: 'Sedan', hourlyRate: 50, dailyRate: 300 },
      { vehicleType: 'SUV', hourlyRate: 75, dailyRate: 450 },
      { vehicleType: 'Motorcycle', hourlyRate: 30, dailyRate: 180 },
      { vehicleType: 'Van', hourlyRate: 80, dailyRate: 500 },
      { vehicleType: 'Truck', hourlyRate: 100, dailyRate: 600 },
    ]);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
