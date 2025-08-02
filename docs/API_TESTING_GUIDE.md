# Genix Hub API Testing Guide

## Quick Start

### 1. Swagger Documentation (Recommended)
- Start the server: `npm run dev`
- Open: http://localhost:5000/api-docs
- **Interactive testing directly in browser!**

### 2. Postman Collection
- Import `docs/Genix_Hub_API.postman_collection.json` into Postman
- Set environment variable `baseUrl` to `http://localhost:5000/api/v1`

### 3. VS Code REST Client
- Install "REST Client" extension in VS Code
- Use the `.http` files in `docs/` folder

---

## API Endpoints Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/schools/register` | POST | Register school |
| `/schools/login` | POST | School login |
| `/schools` | GET | Get all schools |
| `/students/register` | POST | Register student |
| `/students/login` | POST | Student login |
| `/auth/refresh-token` | POST | Refresh access token |
| `/auth/logout` | POST | Logout (requires auth) |

---

## Testing Scenarios

### 1. School Registration & Login Flow

**Step 1: Register School**
```bash
POST /schools/register
{
  "name": "Delhi Public School",
  "password": "password123",
  "confirmPassword": "password123",
  "address": "123 School Street, Central Delhi",
  "city": "New Delhi",
  "state": "Delhi",
  "pincode": "110001",
  "principalName": "Dr. Rajesh Kumar",
  "contactEmail": "principal@dpsdelhi.edu.in",
  "contactPhone": "9876543210"
}
```

**Expected Response (201):**
```json
{
  "message": "Registration successful",
  "data": {
    "school": {
      "id": "60d5ec49f8d2c72b8c8e4a1b",
      "name": "Delhi Public School",
      "city": "New Delhi",
      "state": "Delhi",
      "principalName": "Dr. Rajesh Kumar",
      "contactEmail": "principal@dpsdelhi.edu.in",
      "contactPhone": "9876543210"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Step 2: Login School**
```bash
POST /schools/login
{
  "name": "Delhi Public School",
  "password": "password123"
}
```

### 2. Student Registration & Login Flow

**Step 1: Get Schools List (for dropdown)**
```bash
GET /schools?page=1&limit=10
```

**Step 2: Register Student**
```bash
POST /students/register
{
  "name": "Arjun Sharma",
  "password": "password123",
  "confirmPassword": "password123",
  "schoolId": "60d5ec49f8d2c72b8c8e4a1b"
}
```

**Step 3: Login Student**
```bash
POST /students/login
{
  "name": "Arjun Sharma",
  "password": "password123"
}
```

### 3. Authentication Flow

**Refresh Token**
```bash
POST /auth/refresh-token
{
  "refreshToken": "your_refresh_token_here"
}
```

**Logout (with Bearer token)**
```bash
POST /auth/logout
Authorization: Bearer your_access_token_here
```

---

## Validation Testing

### Test Invalid Data

**1. Invalid School Registration:**
```bash
POST /schools/register
{
  "name": "AB",  // Too short (min 3 chars)
  "password": "123",  // Too short (min 6 chars)
  "confirmPassword": "456",  // Doesn't match
  "pincode": "000000",  // Invalid format
  "contactPhone": "1234567890",  // Invalid Indian mobile
  "contactEmail": "invalid-email"  // Invalid email
}
```

**Expected Response (400):**
```json
{
  "message": "Validation failed",
  "data": [
    {
      "field": "name",
      "message": "Name must be at least 3 characters"
    },
    {
      "field": "confirmPassword",
      "message": "Passwords don't match"
    }
  ]
}
```

**2. Invalid Student Registration:**
```bash
POST /students/register
{
  "name": "",  // Required field empty
  "schoolId": "invalid-id"  // Invalid ObjectId format
}
```

---

## Error Scenarios

### 1. Duplicate Registration
- Try registering same school/student twice
- Expected: 409 Conflict

### 2. Invalid Credentials
- Try login with wrong password
- Expected: 401 Unauthorized

### 3. Invalid Token
- Use expired/invalid JWT token
- Expected: 401 Unauthorized

### 4. School Not Found
- Register student with non-existent schoolId
- Expected: 400 Bad Request

---

## curl Commands for Terminal Testing

### Health Check
```bash
curl -X GET http://localhost:5000/api/v1/health
```

### Register School
```bash
curl -X POST http://localhost:5000/api/v1/schools/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test School",
    "password": "password123",
    "confirmPassword": "password123",
    "address": "123 Test Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "principalName": "Test Principal",
    "contactEmail": "test@school.com",
    "contactPhone": "9876543210"
  }'
```

### Login School
```bash
curl -X POST http://localhost:5000/api/v1/schools/login \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test School",
    "password": "password123"
  }'
```

### Get Schools
```bash
curl -X GET "http://localhost:5000/api/v1/schools?page=1&limit=5"
```

### Register Student
```bash
curl -X POST http://localhost:5000/api/v1/students/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "password": "password123",
    "confirmPassword": "password123",
    "schoolId": "SCHOOL_ID_FROM_PREVIOUS_RESPONSE"
  }'
```

### Logout (with token)
```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

---

## Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": { /* response data */ },
  "pagination": {  // Only for paginated endpoints
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "message": "Error message",
  "data": { /* error details */ }
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 500 | Internal Server Error |

---

## Environment Variables for Testing

### Development
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/genix_hub
JWT_SECRET=change_this_in_production_super_secret_key
JWT_REFRESH_SECRET=change_this_in_production_refresh_secret_key
```

### Production
- Use strong JWT secrets
- Use MongoDB Atlas connection string
- Set appropriate CORS origins
- Use HTTPS URLs

---

## Tips for Testing

1. **Use Swagger first** - Interactive and comprehensive
2. **Save tokens** - Copy access/refresh tokens for authenticated requests
3. **Test validation** - Try invalid data to ensure validation works
4. **Test edge cases** - Empty strings, invalid IDs, wrong formats
5. **Check error messages** - Ensure they're user-friendly
6. **Test pagination** - Try different page/limit values
7. **Monitor logs** - Check server console for detailed error info

---

## Common Issues & Solutions

### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service

### 2. Validation Errors
**Check:** Required fields, data types, format constraints

### 3. JWT Token Issues
**Check:** Token format, expiration, proper Bearer prefix

### 4. CORS Errors
**Check:** Frontend origin is in ALLOWED_ORIGINS env var
