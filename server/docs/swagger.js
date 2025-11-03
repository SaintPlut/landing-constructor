const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Landing Page Builder API',
      version: '1.0.0',
      description: 'API для создания лендингов на основе шаблонов',
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Login: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Имя пользователя'
            },
            password: {
              type: 'string',
              description: 'Пароль'
            }
          }
        },
        Template: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            author: { type: 'string' },
            license: { type: 'string' },
            price: { type: 'number' },
            keywords: { 
              type: 'array',
              items: { type: 'string' }
            },
            thumbnail: { type: 'string' },
            editableBlocks: { type: 'array' }
          }
        },
        Landing: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            templateId: { type: 'integer' },
            content: { type: 'object' },
            isPublished: { type: 'boolean' },
            urlSlug: { type: 'string' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // пути к файлам с роутами
};

const specs = swaggerJsdoc(options);
module.exports = specs;