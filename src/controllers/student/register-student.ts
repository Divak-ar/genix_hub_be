import { Request, Response, NextFunction } from 'express';
import { studentRegistrationSchema } from '../../validation/schemas';
import { Student } from '../../models/Student';
import { School } from '../../models/School';
import { jwtService } from '../../utils/jwt';
import { logger } from '../../utils/logger';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants';
import { ApiResponse, TokenPair } from '../../types';
import mongoose from 'mongoose';

export const registerStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body using Zod
    const validatedData = studentRegistrationSchema.parse(req.body);
    
    // Check if school exists
    const school = await School.findById(validatedData.schoolId);
    if (!school) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: ERROR_MESSAGES.SCHOOL_NOT_FOUND
      });
      return;
    }
    
    // Remove confirmPassword from the data before saving
    const { confirmPassword, ...studentData } = validatedData;
    
    // Create new student
    const student = new Student({
      ...studentData,
      schoolId: new mongoose.Types.ObjectId(validatedData.schoolId)
    });
    
    await student.save();
    
    // Generate tokens
    const tokens: TokenPair = jwtService.generateTokens({
      userId: (student._id as any).toString(),
      role: 'student',
      schoolId: (school._id as any).toString()
    });
    
    // Save refresh token to database
    student.refreshToken = tokens.refreshToken;
    await student.save();
    
    const response: ApiResponse = {
      message: SUCCESS_MESSAGES.REGISTRATION_SUCCESS,
      data: {
        student: {
          id: student._id,
          name: student.name,
          school: {
            id: school._id,
            name: school.name,
            city: school.city,
            state: school.state
          }
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
