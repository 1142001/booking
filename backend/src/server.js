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

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'room-pg-booking-api',
    database: isDatabaseConnected() ? 'connected' : 'disconnected'
  });
});

// DB guard middleware
app.use((req, res, next) => {
  if (req.path === '/api/health') return next();

  if (!isDatabaseConnected()) {
    return res.status(503).json({
      message:
        'Database unavailable. Start MongoDB or set MONGO_URI / MONGODB_URI.'
    });
  }

  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

const PORT = process.env.PORT || 5000;

// DB bootstrap
const bootstrapDatabase = async () => {
  const connected = await connectDB();

  if (!connected) {
    console.warn('⚠️ Running without DB. Retrying every 10s...');
  }

  setInterval(async () => {
    if (!isDatabaseConnected()) {
      await connectDB({ retries: 1, retryDelayMs: 500 });
    }
  }, 10000);
};

// Start server (ONLY ONCE)
const start = async () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  await bootstrapDatabase();
};

start();