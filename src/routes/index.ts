import { Router } from 'express';
import { schoolRoutes } from './schoolRoutes';
import { studentRoutes } from './studentRoutes';
import { authRoutes } from './authRoutes';

const router = Router();

// Mount routes
router.use('/schools', schoolRoutes);
router.use('/students', studentRoutes);
router.use('/auth', authRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    message: 'Genix Hub Backend API is running',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

export { router as apiRoutes };
