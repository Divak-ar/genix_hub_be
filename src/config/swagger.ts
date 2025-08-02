import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Genix Hub API',
      version: '1.0.0',
      description: 'Backend API for Indian School Hackathon Platform',
      contact: {
        name: 'API Support',
        email: 'support@genixhub.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Response message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            data: {
              type: 'object',
              description: 'Error details'
            }
          }
        },
        SchoolRegistration: {
          type: 'object',
          required: ['name', 'password', 'confirmPassword', 'address', 'city', 'state', 'pincode', 'principalName', 'contactEmail', 'contactPhone'],
          properties: {
            name: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              example: 'Delhi Public School'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            },
            confirmPassword: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            },
            address: {
              type: 'string',
              minLength: 5,
              maxLength: 200,
              example: '123 School Street, Central Delhi'
            },
            city: {
              type: 'string',
              maxLength: 50,
              example: 'New Delhi'
            },
            state: {
              type: 'string',
              enum: ['Andhra Pradesh', 'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu'],
              example: 'Delhi'
            },
            pincode: {
              type: 'string',
              pattern: '^[1-9][0-9]{5}$',
              example: '110001'
            },
            principalName: {
              type: 'string',
              maxLength: 100,
              example: 'Dr. Rajesh Kumar'
            },
            contactEmail: {
              type: 'string',
              format: 'email',
              example: 'principal@dpsdelhi.edu.in'
            },
            contactPhone: {
              type: 'string',
              pattern: '^[6-9]\\d{9}$',
              example: '9876543210'
            }
          }
        },
        SchoolLogin: {
          type: 'object',
          required: ['name', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'Delhi Public School'
            },
            password: {
              type: 'string',
              example: 'password123'
            }
          }
        },
        StudentRegistration: {
          type: 'object',
          required: ['name', 'password', 'confirmPassword', 'schoolId'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              example: 'Arjun Sharma'
            },
            password: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            },
            confirmPassword: {
              type: 'string',
              minLength: 6,
              example: 'password123'
            },
            schoolId: {
              type: 'string',
              pattern: '^[0-9a-fA-F]{24}$',
              example: '60d5ec49f8d2c72b8c8e4a1b'
            }
          }
        },
        StudentLogin: {
          type: 'object',
          required: ['name', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'Arjun Sharma'
            },
            password: {
              type: 'string',
              example: 'password123'
            }
          }
        },
        RefreshToken: {
          type: 'object',
          required: ['refreshToken'],
          properties: {
            refreshToken: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Schools',
        description: 'School management operations'
      },
      {
        name: 'Students',
        description: 'Student management operations'
      },
      {
        name: 'Authentication',
        description: 'Authentication and authorization'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/**/*.ts']
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Genix Hub API Documentation',
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true
    }
  }));
};

export { specs as swaggerSpecs };
