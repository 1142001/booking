import mongoose from 'mongoose';

const sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

export const connectDB = async ({ retries = 5, retryDelayMs = 2000 } = {}) => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing. Add it in backend/.env');
  }

  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
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
