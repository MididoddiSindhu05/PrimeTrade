module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Primetrade Backend API',
    version: '1.0.0',
    description: 'Authentication, role-based access, and task CRUD API',
  },
  servers: [{ url: 'http://localhost:4000/api/v1' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['user', 'admin'] },
        },
      },
      Task: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string' },
          description: { type: 'string' },
          completed: { type: 'boolean' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' },
                  role: { type: 'string', enum: ['user', 'admin'] },
                },
                required: ['name', 'email', 'password'],
              },
            },
          },
        },
        responses: {
          201: { description: 'Registered successfully' },
          400: { description: 'Validation error' },
          409: { description: 'Email already registered' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Log in user and return JWT',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
                required: ['email', 'password'],
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/tasks': {
      get: {
        summary: 'List tasks for authenticated user',
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Task list' } },
      },
      post: {
        summary: 'Create a task for authenticated user',
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                },
                required: ['title'],
              },
            },
          },
        },
        responses: { 201: { description: 'Task created' } },
      },
    },
    '/tasks/{id}': {
      parameters: [{ name: 'id', in: 'path', schema: { type: 'integer' }, required: true }],
      get: {
        summary: 'Get a task by id',
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Task returned' }, 404: { description: 'Not found' } },
      },
      put: {
        summary: 'Update a task',
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  completed: { type: 'boolean' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Task updated' }, 404: { description: 'Not found' } },
      },
      delete: {
        summary: 'Delete a task',
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        responses: { 204: { description: 'Deleted successfully' }, 404: { description: 'Not found' } },
      },
    },
    '/admin/users': {
      get: {
        summary: 'List all users (admin only)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Users returned' }, 403: { description: 'Forbidden' } },
      },
    },
  },
};
