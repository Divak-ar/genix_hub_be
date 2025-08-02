import { Router } from 'express';
import { refreshToken } from '../controllers/auth/refresh-token';
import { logout } from '../controllers/auth/logout';
import { authenticate } from '../middleware/auth';

const router = Router();

// Refresh access token
router.post('/refresh-token', refreshToken);

// Logout (requires authentication)
router.post('/logout', authenticate, logout);

export { router as authRoutes };
