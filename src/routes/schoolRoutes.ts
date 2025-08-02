import { Router } from 'express';
import { registerSchool } from '../controllers/school/register-school';
import { loginSchool } from '../controllers/school/login-school';
import { getAllSchools } from '../controllers/school/get-all-schools';

const router = Router();

// School registration
router.post('/register', registerSchool);

// School login
router.post('/login', loginSchool);

// Get all schools (for student registration dropdown)
router.get('/', getAllSchools);

export { router as schoolRoutes };
