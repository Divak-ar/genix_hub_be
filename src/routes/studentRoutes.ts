import { Router } from 'express';
import { registerStudent } from '../controllers/student/register-student';
import { loginStudent } from '../controllers/student/login-student';

const router = Router();

// Student registration
router.post('/register', registerStudent);

// Student login
router.post('/login', loginStudent);

export { router as studentRoutes };
