export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  message: string;
  data?: any;
  pagination?: any;
  error?: string;
  stack?: string;
}

export interface JWTPayload {
  userId: string;
  role: 'student' | 'school';
  schoolId?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Student Types
export interface StudentRegistration {
  name: string;
  password: string;
  confirmPassword: string;
  schoolId: string;
}

export interface StudentLogin {
  name: string;
  password: string;
}

// School Types  
export interface SchoolRegistration {
  name: string;
  password: string;
  confirmPassword: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  principalName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface SchoolLogin {
  name: string;
  password: string;
}
