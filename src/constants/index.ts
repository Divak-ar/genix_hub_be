// Indian States for school registration
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttarakhand', 'Uttar Pradesh', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
  'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep'
] as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Validation failed',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'Internal server error',
  USER_EXISTS: 'User already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  SCHOOL_NOT_FOUND: 'School not found',
  STUDENT_NOT_FOUND: 'Student not found',
  INVALID_TOKEN: 'Invalid token',
  TOKEN_EXPIRED: 'Token expired'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  REGISTRATION_SUCCESS: 'Registration successful',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  DATA_FETCHED: 'Data fetched successfully',
  TOKEN_REFRESHED: 'Token refreshed successfully'
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
} as const;
