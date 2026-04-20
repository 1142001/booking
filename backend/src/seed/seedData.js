import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import { Property } from '../models/Property.js';

dotenv.config();

const demoProperties = [
  {
    title: 'Cozy Single Room near Metro',
    description: 'Fully furnished room ideal for students and interns.',
    location: 'Bengaluru',
    type: 'room',
    rentPerMonth: 9000,
    deposit: 15000,
    amenities: ['WiFi', 'Laundry', 'Power backup'],
    availableBeds: 1,
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85']
  },
  {
    title: 'Shared PG for Boys',
    description: 'Affordable PG with food and housekeeping included.',
    location: 'Pune',
    type: 'pg',
    rentPerMonth: 7000,
    deposit: 10000,
    amenities: ['Food', 'CCTV', 'Gym'],
    availableBeds: 3,
    images: ['https://images.unsplash.com/photo-1560185127-6ed189bf02f4']
  }
];

const seed = async () => {
  try {
    await connectDB();
    await Property.deleteMany({});
    await Property.insertMany(demoProperties);
    console.log('Demo properties inserted');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
