import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'room-pg-booking-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Could not connect to MongoDB.');
    console.error('Troubleshooting:');
    console.error('1) Ensure MongoDB is running locally on 127.0.0.1:27017 OR');
    console.error('2) Start MongoDB via Docker: docker compose up -d mongo OR');
    console.error('3) Use MongoDB Atlas and set MONGODB_URI in backend/.env (optional if using local default)');
    console.error(`Original error: ${error.message}`);
    process.exit(1);
  }
};

start();
