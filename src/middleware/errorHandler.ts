import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';
import { ErrorResponse } from '../types';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message: string = ERROR_MESSAGES.INTERNAL_ERROR;
  let data: any = null;

  // Zod validation errors
  if (error instanceof ZodError) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = ERROR_MESSAGES.VALIDATION_ERROR;
    data = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message
    }));
  }
  // MongoDB duplicate key error
  else if (error.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    const field = Object.keys(error.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }
  // MongoDB validation error
  else if (error.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = ERROR_MESSAGES.VALIDATION_ERROR;
    data = Object.values(error.errors).map((err: any) => ({
      field: err.path,
      message: err.message
    }));
  }
  // JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = ERROR_MESSAGES.INVALID_TOKEN;
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = ERROR_MESSAGES.TOKEN_EXPIRED;
  }
  // Custom application errors
  else if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }

  const errorResponse: ErrorResponse = {
    message,
    data,
    ...(process.env.NODE_ENV === 'development' && { 
      error: error.message,
      stack: error.stack 
    })
  };

  // Log the error
  logger.error(message, data, null, error);

  res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const errorResponse: ErrorResponse = {
    message: ERROR_MESSAGES.NOT_FOUND,
    data: { path: req.originalUrl }
  };

  logger.warn(ERROR_MESSAGES.NOT_FOUND, { path: req.originalUrl });
  res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse);
};
