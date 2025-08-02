# Genix Hub Backend

Simple Node.js Express backend for Indian School Hackathon Platform.

## Features

- **JWT Authentication** with access and refresh tokens
- **Student and School** registration and login
- **MongoDB** with Mongoose ODM
- **Zod validation** in controllers
- **Global logger** that catches { message, data, pagination }
- **TypeScript** support

## Quick Start

1. **Install dependencies**
```bash
npm install
```

2. **Environment Setup**
Update `.env` file with your MongoDB URI and JWT secrets.

3. **Run the application**
```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## API Endpoints

### Schools
- `POST /api/v1/schools/register` - School registration
- `POST /api/v1/schools/login` - School login  
- `GET /api/v1/schools` - Get all schools (for student dropdown)

### Students
- `POST /api/v1/students/register` - Student registration (requires schoolId)
- `POST /api/v1/students/login` - Student login

### Auth
- `POST /api/v1/auth/refresh-token` - Refresh JWT token
- `POST /api/v1/auth/logout` - Logout (clears refresh token)

## Error Response Format
```json
{
  "message": "Error description",
  "data": { /* validation errors or additional data */ }
}
```

## Success Response Format  
```json
{
  "message": "Success message",
  "data": { /* response data */ },
  "pagination": { /* if applicable */ }
}
```

The global logger captures all responses in this format for both success and error cases.

