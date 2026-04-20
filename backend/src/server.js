import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB, isDatabaseConnected } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'room-pg-booking-api',
    database: isDatabaseConnected() ? 'connected' : 'disconnected'
  });
});

app.use((req, res, next) => {
  if (req.path === '/api/health') return next();

  if (!isDatabaseConnected()) {
    return res.status(503).json({
      message:
        'Database is currently unavailable. Start MongoDB locally, run `docker compose up -d mongo`, or configure MONGODB_URI.'
    });
  }

  return next();
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

const PORT = process.env.PORT || 5000;

const bootstrapDatabase = async () => {
  const connected = await connectDB();

  if (!connected) {
    console.warn('⚠️ Server is running without database connection.');
    console.warn('It will retry in the background every 10 seconds.');
  }

  setInterval(async () => {
    if (!isDatabaseConnected()) {
      await connectDB({ retries: 1, retryDelayMs: 500 });
    }
  }, 10000);
};

const start = async () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  await bootstrapDatabase();
};

start();
