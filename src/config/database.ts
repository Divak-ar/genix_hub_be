import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/genix_hub';
    
    await mongoose.connect(mongoUri);
    
    logger.success('Database connected successfully', {
      uri: mongoUri.replace(/\/\/.*@/, '//*****@') // Hide credentials in logs
    });
  } catch (error) {
    logger.error('Database connection failed', null, null, error as Error);
    process.exit(1);
  }
};

mongoose.connection.on('error', (error) => {
  logger.error('Database connection error', null, null, error);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Database disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('Database connection closed');
  process.exit(0);
});
