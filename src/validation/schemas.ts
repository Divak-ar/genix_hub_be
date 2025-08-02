import { z } from 'zod';
import { INDIAN_STATES } from '../constants';

// Student validation schemas
export const studentRegistrationSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be less than 50 characters'),
  confirmPassword: z.string(),
  schoolId: z.string()
    .min(1, 'School selection is required')
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID format')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const studentLoginSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .trim(),
  password: z.string()
    .min(1, 'Password is required')
});

// School validation schemas
export const schoolRegistrationSchema = z.object({
  name: z.string()
    .min(3, 'School name must be at least 3 characters')
    .max(100, 'School name must be less than 100 characters')
    .trim(),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be less than 50 characters'),
  confirmPassword: z.string(),
  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters')
    .trim(),
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .trim(),
  state: z.enum(INDIAN_STATES as any, {
    errorMap: () => ({ message: 'Please select a valid Indian state' })
  }),
  pincode: z.string()
    .regex(/^[1-9][0-9]{5}$/, 'Please enter a valid Indian pincode'),
  principalName: z.string()
    .min(2, 'Principal name must be at least 2 characters')
    .max(100, 'Principal name must be less than 100 characters')
    .trim(),
  contactEmail: z.string()
    .email('Please enter a valid email address')
    .toLowerCase(),
  contactPhone: z.string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const schoolLoginSchema = z.object({
  name: z.string()
    .min(1, 'School name is required')
    .trim(),
  password: z.string()
    .min(1, 'Password is required')
});

// Token validation schemas
export const refreshTokenSchema = z.object({
  refreshToken: z.string()
    .min(1, 'Refresh token is required')
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(10)
});

export type StudentRegistrationInput = z.infer<typeof studentRegistrationSchema>;
export type StudentLoginInput = z.infer<typeof studentLoginSchema>;
export type SchoolRegistrationInput = z.infer<typeof schoolRegistrationSchema>;
export type SchoolLoginInput = z.infer<typeof schoolLoginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
