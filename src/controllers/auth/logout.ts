import { Request, Response, NextFunction } from 'express';
import { Student } from '../../models/Student';
import { School } from '../../models/School';
import { logger } from '../../utils/logger';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../constants';
import { ApiResponse } from '../../types';

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user!; // User is guaranteed to exist due to auth middleware
    
    // Remove refresh token from database
    if (user.role === 'student') {
      await Student.findByIdAndUpdate(user.userId, { $unset: { refreshToken: 1 } });
    } else if (user.role === 'school') {
      await School.findByIdAndUpdate(user.userId, { $unset: { refreshToken: 1 } });
    }
    
    const response: ApiResponse = {
      message: SUCCESS_MESSAGES.LOGOUT_SUCCESS
    };
    
    logger.logSuccess(response);
    res.status(HTTP_STATUS.OK).json(response);
    
  } catch (error) {
    next(error);
  }
};
