import { Request, Response, NextFunction } from 'express';
import { schoolLoginSchema } from '../../validation/schemas';
import { School } from '../../models/School';
import { jwtService } from '../../utils/jwt';
import { logger } from '../../utils/logger';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants';
import { ApiResponse, TokenPair } from '../../types';

export const loginSchool = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body using Zod
    const validatedData = schoolLoginSchema.parse(req.body);
    
    // Find school by name
    const school = await School.findOne({ name: validatedData.name });
    
    if (!school) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.INVALID_CREDENTIALS
      });
      return;
    }
    
    // Check password
    const isPasswordValid = await school.comparePassword(validatedData.password);
    
    if (!isPasswordValid) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.INVALID_CREDENTIALS
      });
      return;
    }
    
    // Generate tokens
    const tokens: TokenPair = jwtService.generateTokens({
      userId: (school._id as any).toString(),
      role: 'school'
    });
    
    // Save refresh token to database
    school.refreshToken = tokens.refreshToken;
    await school.save();
    
    const response: ApiResponse = {
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      data: {
        school: {
          id: school._id,
          name: school.name,
          city: school.city,
          state: school.state,
          principalName: school.principalName,
          contactEmail: school.contactEmail,
          contactPhone: school.contactPhone
        },
        tokens
      }
    };
    
    logger.logSuccess(response);
    res.status(HTTP_STATUS.OK).json(response);
    
  } catch (error) {
    next(error);
  }
};
