import mongoose from 'mongoose';

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const getMongoUri = () => {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;

  const fallbackUri = 'mongodb://127.0.0.1:27017/room_pg_booking';
  console.warn(
    `MONGODB_URI is not set. Falling back to default local Mongo URI: ${fallbackUri}`
  );
  return fallbackUri;
};

export const connectDB = async ({ retries = 5, retryDelayMs = 2000 } = {}) => {
  let lastError;
  const mongoUri = getMongoUri();

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      lastError = error;
      console.error(
        `DB connection attempt ${attempt}/${retries} failed: ${error.message}`
      );

      if (attempt < retries) {
        await sleep(retryDelayMs);
      }
    }
  }

  throw lastError;
};
