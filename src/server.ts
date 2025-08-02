import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { apiRoutes } from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// API routes
app.use('/api/v1', apiRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      logger.success('Server started successfully', {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version
      });
      
      logger.info('Available endpoints:', {
        health: `/api/v1/health`,
        schoolRegister: `/api/v1/schools/register`,
        schoolLogin: `/api/v1/schools/login`,
        getAllSchools: `/api/v1/schools`,
        studentRegister: `/api/v1/students/register`,
        studentLogin: `/api/v1/students/login`,
        refreshToken: `/api/v1/auth/refresh-token`,
        logout: `/api/v1/auth/logout`
      });
    });
  } catch (error) {
    logger.error('Failed to start server', null, null, error as Error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error('Unhandled Promise Rejection', null, null, err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception', null, null, err);
  process.exit(1);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
