import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../utils/jwt';
import { Student } from '../models/Student';
import { School } from '../models/School';
import { JWTPayload } from '../types';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = jwtService.extractTokenFromHeader(req.headers.authorization);
    const payload = jwtService.verifyAccessToken(token);
    
    // Verify user still exists
    let userExists = false;
    if (payload.role === 'student') {
      userExists = await Student.findById(payload.userId).select('_id').lean() !== null;
    } else if (payload.role === 'school') {
      userExists = await School.findById(payload.userId).select('_id').lean() !== null;
    }

    if (!userExists) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: ERROR_MESSAGES.UNAUTHORIZED
    });
  }
};

export const requireRole = (roles: ('student' | 'school')[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        message: ERROR_MESSAGES.UNAUTHORIZED
      });
      return;
    }
    next();
  };
};
