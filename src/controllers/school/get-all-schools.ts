import { Request, Response, NextFunction } from 'express';
import { paginationSchema } from '../../validation/schemas';
import { School } from '../../models/School';
import { logger } from '../../utils/logger';
import { HTTP_STATUS, SUCCESS_MESSAGES } from '../../constants';
import { ApiResponse } from '../../types';

export const getAllSchools = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate pagination parameters
    const { page, limit } = paginationSchema.parse(req.query);
    
    const skip = (page - 1) * limit;
    
    // Get schools with pagination
    const [schools, total] = await Promise.all([
      School.find({}, 'name city state principalName')
        .skip(skip)
        .limit(limit)
        .sort({ name: 1 })
        .lean(),
      School.countDocuments()
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    const response: ApiResponse = {
      message: SUCCESS_MESSAGES.DATA_FETCHED,
      data: {
        schools: schools.map(school => ({
          id: school._id,
          name: school.name,
          city: school.city,
          state: school.state,
          principalName: school.principalName
        }))
      },
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
    
    logger.logSuccess(response);
    res.status(HTTP_STATUS.OK).json(response);
    
  } catch (error) {
    next(error);
  }
};
