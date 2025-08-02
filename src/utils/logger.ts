import { ApiResponse, ErrorResponse } from '../types';

class Logger {
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: string, message: string, data?: any, pagination?: any): string {
    const timestamp = this.formatTimestamp();
    const logData = {
      timestamp,
      level,
      message,
      ...(data && { data }),
      ...(pagination && { pagination })
    };
    return JSON.stringify(logData, null, 2);
  }

  success(message: string, data?: any, pagination?: any): void {
    console.log('\x1b[32m%s\x1b[0m', this.formatMessage('SUCCESS', message, data, pagination));
  }

  error(message: string, data?: any, pagination?: any, error?: Error): void {
    const errorData = {
      ...data,
      ...(error && { 
        error: error.message,
        stack: error.stack 
      })
    };
    console.error('\x1b[31m%s\x1b[0m', this.formatMessage('ERROR', message, errorData, pagination));
  }

  info(message: string, data?: any, pagination?: any): void {
    console.info('\x1b[34m%s\x1b[0m', this.formatMessage('INFO', message, data, pagination));
  }

  warn(message: string, data?: any, pagination?: any): void {
    console.warn('\x1b[33m%s\x1b[0m', this.formatMessage('WARN', message, data, pagination));
  }

  debug(message: string, data?: any, pagination?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug('\x1b[35m%s\x1b[0m', this.formatMessage('DEBUG', message, data, pagination));
    }
  }

  // Helper methods for API responses
  logSuccess(response: ApiResponse): void {
    this.success(response.message, response.data, response.pagination);
  }

  logError(error: ErrorResponse): void {
    this.error(error.message, error.data, error.pagination);
  }
}

export const logger = new Logger();
