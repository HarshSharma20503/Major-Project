import mongoose from "mongoose";
import logger from "../utils/logger.js";

export const connectDB = async (): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(
      process.env.MONGODB_URI as string
    );
    logger.info(`MongoDB connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    logger.error("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;
