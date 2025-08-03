import { Request, Response, NextFunction } from 'express';
import { studentLoginSchema } from '../../validation/schemas';
import { Student } from '../../models/Student';
import { School } from '../../models/School';
import { jwtService } from '../../utils/jwt';
import { logger } from '../../utils/logger';
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants';
import { ApiResponse, TokenPair } from '../../types';

export const loginStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate request body using Zod
    const validatedData = studentLoginSchema.parse(req.body);
    
    // Find student by name and populate school data
    const student = await Student.findOne({ name: validatedData.name })
      .populate('schoolId', 'name city state');
    
    if (!student) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.INVALID_CREDENTIALS
      });
      return;
    }
    
    // Check password
    const isPasswordValid = await student.comparePassword(validatedData.password);
    
    if (!isPasswordValid) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: ERROR_MESSAGES.INVALID_CREDENTIALS
      });
      return;
    }
    
    // Generate tokens
    const tokens: TokenPair = jwtService.generateTokens({
      userId: (student._id as any).toString(),
      role: 'student',
      schoolId: student.schoolId.toString()
    });
    
    // Save refresh token to database
    student.refreshToken = tokens.refreshToken;
    await student.save();
    
    const school = student.schoolId as any; // Type assertion for populated field
    
    const response: ApiResponse = {
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      data: {
        student: {
          id: student._id,
          name: student.name,
          class: student.class,
          section: student.section,
          gender: student.gender,
          rollNo: student.rollNo,
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
    res.status(HTTP_STATUS.OK).json(response);
    
  } catch (error) {
    next(error);
  }
};
