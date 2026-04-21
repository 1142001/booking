import mongoose from 'mongoose';

mongoose.set('bufferCommands', false);

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const getMongoUri = () => {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;

  const fallbackUri = 'mongodb+srv://siddheshwari:Siddhi%40123@cluster0.ju24qld.mongodb.net/?stay';

  console.warn(
    `⚠️ No MONGO_URI or MONGODB_URI set. Using fallback: ${fallbackUri}`
  );

  return fallbackUri;
};

export const isDatabaseConnected = () =>
  mongoose.connection.readyState === 1;

export const connectDB = async ({ retries = 5, retryDelayMs = 2000 } = {}) => {
  if (isDatabaseConnected()) return true;

  let lastError;
  const mongoUri = getMongoUri();

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(mongoUri);

      console.log(
        `✅ MongoDB connected: ${conn?.connection?.host || 'unknown'}`
      );

      return true;
    } catch (error) {
      lastError = error;

      console.error(
        `❌ Attempt ${attempt}/${retries} failed: ${error.message}`
      );

      if (attempt < retries) {
        await sleep(retryDelayMs);
      }
    }
  }

  console.error(`❌ MongoDB not connected: ${lastError.message}`);
  return false;
};