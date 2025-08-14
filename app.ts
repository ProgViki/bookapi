import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './src/config/swagger';
import authRouter from './src/routes/auth.routes';
import courseRouter from './src/routes/course.routes';


const app = express();

app.use(express.json());

// Swagger API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/courses', courseRouter);

export default app;
