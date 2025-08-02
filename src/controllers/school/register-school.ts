import { Request, Response, NextFunction } from 'express';
import { schoolRegistrationSchema } from '../../validation/schemas';
import { School } from '../../models/School';
import { jwtService } from '../../utils/jwt';
import { logger } from '../../utils/logger';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants';
import { ApiResponse, TokenPair } from '../../types';

export const registerSchool = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body using Zod
    const validatedData = schoolRegistrationSchema.parse(req.body);
    
    // Remove confirmPassword from the data before saving
    const { confirmPassword, ...schoolData } = validatedData;
    
    // Create new school
    const school = new School(schoolData);
    await school.save();
    
    // Generate tokens
    const tokens: TokenPair = jwtService.generateTokens({
      userId: (school._id as any).toString(),
      role: 'school'
    });
    
    // Save refresh token to database
    school.refreshToken = tokens.refreshToken;
    await school.save();
    
    const response: ApiResponse = {
      message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
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
    res.status(HTTP_STATUS.CREATED).json(response);
    
  } catch (error) {
    next(error);
  }
};
