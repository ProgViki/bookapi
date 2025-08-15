import request from 'supertest';
import express from 'express';
import authRouter from '../routes/auth.routes';
import { AuthService } from '../services/auth.service';
import { authenticate } from '../middleware/auth.middleware';

// Mock the AuthService and auth middleware
jest.mock('../services/auth.service');
jest.mock('../middleware/auth.middleware', () => ({
  authenticate: jest.fn((req, res, next) => {
    req.user = { id: 1, name: 'Test User', email: 'test@example.com' }; // Mock authenticated user
    next();
  }),
}));

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date().toISOString(),
      };

      (AuthService.register as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
      expect(AuthService.register).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
        }); // Missing name

      expect(response.status).toBe(400);
    });

    it('should return 400 if email already exists', async () => {
      (AuthService.register as jest.Mock).mockRejectedValue(new Error('Email already in use'));

      const response = await request(app)
        .post('/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Email already in use' });
    });
  });

  describe('POST /auth/login', () => {
    it('should login a user with valid credentials', async () => {
      const mockResponse = {
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
        },
        token: 'mock_token',
      };

      (AuthService.login as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse);
    });

    it('should return 401 for invalid credentials', async () => {
      (AuthService.login as jest.Mock).mockRejectedValue(new Error('Invalid email or password'));

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrong_password',
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid email or password' });
    });
  });

  describe('GET /auth/me', () => {
    it('should return the current authenticated user', async () => {
      const response = await request(app).get('/auth/me');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      });
      expect(authenticate).toHaveBeenCalled();
    });
  });

  describe('GET /auth/users', () => {
    it('should return all users (protected route)', async () => {
      const mockUsers = [
        {
          id: 1,
          name: 'User 1',
          email: 'user1@example.com',
          createdAt: new Date().toISOString(),
        },
      ];

      (AuthService.getUsers as jest.Mock).mockResolvedValue(mockUsers);

      const response = await request(app).get('/auth/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(authenticate).toHaveBeenCalled();
    });
  });

  describe('GET /auth/users/:id', () => {
    it('should return a user by ID (protected route)', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date().toISOString(),
      };

      (AuthService.getUserById as jest.Mock).mockResolvedValue(mockUser);

      const response = await request(app).get('/auth/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(authenticate).toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      (AuthService.getUserById as jest.Mock).mockRejectedValue(new Error('User not found'));

      const response = await request(app).get('/auth/users/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'User not found' });
    });
  });
});