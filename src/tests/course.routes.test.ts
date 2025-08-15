import request from 'supertest';
import express from 'express';
import courseRouter from '../routes/course.routes';
import CourseService from '../services/course.service';
import { authenticate } from '../middleware/auth.middleware';

// Mock the CourseService and auth middleware
jest.mock('../services/course.service');
jest.mock('../middleware/auth.middleware', () => ({
  authenticate: jest.fn((req, res, next) => {
    req.user = { id: 1, role: 'INSTRUCTOR' }; // Mock authenticated user
    next();
  }),
}));

const app = express();
app.use(express.json());
app.use('/courses', courseRouter);

describe('Course Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /courses', () => {
    it('should create a new course', async () => {
      const mockCourse = {
        id: 1,
        title: 'Test Course',
        description: 'Test Description',
        instructorId: 1,
      };

      (CourseService.createCourse as jest.Mock).mockResolvedValue(mockCourse);

      const response = await request(app)
        .post('/courses')
        .send({
          title: 'Test Course',
          description: 'Test Description',
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockCourse);
      expect(CourseService.createCourse).toHaveBeenCalledWith(
        'Test Course',
        'Test Description',
        1
      );
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/courses')
        .send({
          description: 'Missing title',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /courses', () => {
    it('should return all courses', async () => {
      const mockCourses = [
        {
          id: 1,
          title: 'Course 1',
          description: 'Description 1',
          instructorId: 1,
          instructor: {
            id: 1,
            name: 'Instructor 1',
          },
        },
      ];

      (CourseService.getCourses as jest.Mock).mockResolvedValue(mockCourses);

      const response = await request(app).get('/courses');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCourses);
    });
  });

  describe('GET /courses/:id', () => {
    it('should return a course by ID', async () => {
      const mockCourse = {
        id: 1,
        title: 'Test Course',
        description: 'Test Description',
        instructorId: 1,
        instructor: {
          id: 1,
          name: 'Test Instructor',
        },
      };

      (CourseService.getCourseById as jest.Mock).mockResolvedValue(mockCourse);

      const response = await request(app).get('/courses/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCourse);
    });

    it('should return 404 if course not found', async () => {
      (CourseService.getCourseById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get('/courses/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Course not found' });
    });
  });

  describe('PUT /courses/:id', () => {
    it('should update a course', async () => {
      const mockCourse = {
        id: 1,
        title: 'Test Course',
        description: 'Test Description',
        instructorId: 1,
      };

      const mockUpdatedCourse = {
        ...mockCourse,
        title: 'Updated Course',
      };

      (CourseService.getCourseById as jest.Mock).mockResolvedValue(mockCourse);
      (CourseService.updateCourse as jest.Mock).mockResolvedValue(mockUpdatedCourse);

      const response = await request(app)
        .put('/courses/1')
        .send({
          title: 'Updated Course',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedCourse);
    });

    it('should return 403 if user is not the instructor', async () => {
      const mockCourse = {
        id: 1,
        title: 'Test Course',
        description: 'Test Description',
        instructorId: 2, // Different instructor
      };

      (CourseService.getCourseById as jest.Mock).mockResolvedValue(mockCourse);

      const response = await request(app)
        .put('/courses/1')
        .send({
          title: 'Updated Course',
        });

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ message: 'Not authorized to update this course' });
    });

    it('should return 404 if course not found', async () => {
      (CourseService.getCourseById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put('/courses/999')
        .send({
          title: 'Updated Course',
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Course not found' });
    });
  });

  describe('DELETE /courses/:id', () => {
    it('should delete a course', async () => {
      const mockCourse = {
        id: 1,
        title: 'Test Course',
        description: 'Test Description',
        instructorId: 1,
      };

      (CourseService.getCourseById as jest.Mock).mockResolvedValue(mockCourse);
      (CourseService.deleteCourse as jest.Mock).mockResolvedValue(mockCourse);

      const response = await request(app).delete('/courses/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCourse);
    });

    it('should return 403 if user is not the instructor', async () => {
      const mockCourse = {
        id: 1,
        title: 'Test Course',
        description: 'Test Description',
        instructorId: 2, // Different instructor
      };

      (CourseService.getCourseById as jest.Mock).mockResolvedValue(mockCourse);

      const response = await request(app).delete('/courses/1');

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ message: 'Not authorized to delete this course' });
    });

    it('should return 404 if course not found', async () => {
      (CourseService.getCourseById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete('/courses/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Course not found' });
    });
  });

  describe('GET /courses/instructor/:instructorId', () => {
    it('should return courses by instructor', async () => {
      const mockCourses = [
        {
          id: 1,
          title: 'Course 1',
          description: 'Description 1',
          instructorId: 1,
        },
      ];

      (CourseService.getCoursesByInstructor as jest.Mock).mockResolvedValue(mockCourses);

      const response = await request(app).get('/courses/instructor/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCourses);
    });
  });
});