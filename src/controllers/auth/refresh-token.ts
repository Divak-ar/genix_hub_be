import { Request, Response, NextFunction } from 'express';
import { refreshTokenSchema } from '../../validation/schemas';
import { Student } from '../../models/Student';
import { School } from '../../models/School';
import { jwtService } from '../../utils/jwt';
import { logger } from '../../utils/logger';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants';
import { ApiResponse, TokenPair } from '../../types';

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body using Zod
    const { refreshToken } = refreshTokenSchema.parse(req.body);
    
    // Verify refresh token
    const payload = jwtService.verifyRefreshToken(refreshToken);
    
    // Find user and verify refresh token exists in database
    let user: any;
    if (payload.role === 'student') {
      user = await Student.findById(payload.userId);
    } else if (payload.role === 'school') {
      user = await School.findById(payload.userId);
    }
    
    if (!user || user.refreshToken !== refreshToken) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.INVALID_TOKEN
      });
      return;
    }
    
    // Generate new tokens
    const newTokens: TokenPair = jwtService.generateTokens({
      userId: payload.userId,
      role: payload.role,
      ...(payload.schoolId && { schoolId: payload.schoolId })
    });
    
    // Update refresh token in database
    user.refreshToken = newTokens.refreshToken;
    await user.save();
    
    const response: ApiResponse = {
      message: SUCCESS_MESSAGES.TOKEN_REFRESHED,
      data: {
        tokens: newTokens
      }
    };
    
    logger.logSuccess(response);
    res.status(HTTP_STATUS.OK).json(response);
    
  } catch (error) {
    next(error);
  }
};
