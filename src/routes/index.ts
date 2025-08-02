import { Router } from 'express';
import { schoolRoutes } from './schoolRoutes';
import { studentRoutes } from './studentRoutes';
import { authRoutes } from './authRoutes';
import { ApiResponse } from '../types';
import { SUCCESS_MESSAGES, HTTP_STATUS } from '../constants';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               message: "API is healthy"
 *               data:
 *                 status: "ok"
 *                 timestamp: "2025-08-02T10:30:00.000Z"
 */
router.get('/health', (req, res) => {
  const response: ApiResponse = {
    message: 'API is healthy',
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }
  };
  res.status(HTTP_STATUS.OK).json(response);
});

// Mount route modules
router.use('/schools', schoolRoutes);
router.use('/students', studentRoutes);
router.use('/auth', authRoutes);

export { router as apiRoutes };
