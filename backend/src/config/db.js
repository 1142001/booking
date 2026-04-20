import mongoose from 'mongoose';

mongoose.set('bufferCommands', false);

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const getMongoUri = () => {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;

  const fallbackUri = 'mongodb://127.0.0.1:27017/room_pg_booking';
  console.warn(
    `MONGO_URI is not set. Falling back to default local Mongo URI: ${fallbackUri}`
    `MONGODB_URI is not set. Falling back to default local Mongo URI: ${fallbackUri}`
  );
  return fallbackUri;
};

export const isDatabaseConnected = () => mongoose.connection.readyState === 1;

export const connectDB = async ({ retries = 5, retryDelayMs = 2000 } = {}) => {
  if (isDatabaseConnected()) return true;

  let lastError;
  const mongoUri = getMongoUri();

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return true;
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

  console.error(`MongoDB not connected after retries: ${lastError.message}`);
  return false;
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`DB connection failed: ${error.message}`);
    process.exit(1);
  }
};
