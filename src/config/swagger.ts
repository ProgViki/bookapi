import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation for my project',
    },
    servers: [
      {
        url: 'http://localhost:5000/api', // change to your API base URL
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // path to your route files
};

export const swaggerSpec = swaggerJSDoc(options);
