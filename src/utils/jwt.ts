const jwt = require('jsonwebtoken');
import { JWTPayload, TokenPair } from '../types';
import { logger } from './logger';

class JWTService {
  private jwtSecret: string;
  private refreshSecret: string;
  private jwtExpiresIn: string;
  private refreshExpiresIn: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m';
    this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  generateTokens(payload: JWTPayload): TokenPair {
    try {
      const accessToken = jwt.sign(payload, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn
      });

      const refreshToken = jwt.sign(payload, this.refreshSecret, {
        expiresIn: this.refreshExpiresIn
      });

      return { accessToken, refreshToken };
    } catch (error) {
      logger.error('Token generation failed', null, null, error as Error);
      throw new Error('Token generation failed');
    }
  }

  verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.jwtSecret) as JWTPayload;
    } catch (error) {
      logger.error('Access token verification failed', { token: token.substring(0, 20) + '...' });
      throw new Error('Invalid access token');
    }
  }

  verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.refreshSecret) as JWTPayload;
    } catch (error) {
      logger.error('Refresh token verification failed', { token: token.substring(0, 20) + '...' });
      throw new Error('Invalid refresh token');
    }
  }

  extractTokenFromHeader(authHeader: string | undefined): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Invalid authorization header');
    }
    return authHeader.substring(7);
  }
}

export const jwtService = new JWTService();
