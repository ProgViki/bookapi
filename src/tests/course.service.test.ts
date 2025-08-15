import CourseService from '../services/course.service';
import prisma from '../utils/prisma';
import { Course, User } from '@prisma/client';

// Mock the prisma client
jest.mock('../utils/prisma', () => ({
  course: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('CourseService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCourse', () => {
    it('should create a new course', async () => {
      const mockCourse = {
        id: 1,
        title: 'Test Course',
        description: 'Test Description',
        instructorId: 1,
      };

      (prisma.course.create as jest.Mock).mockResolvedValue(mockCourse);

      const result = await CourseService.createCourse('Test Course', 'Test Description', 1);

      expect(prisma.course.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Course',
          description: 'Test Description',
          instructorId: 1,
        },
      });
      expect(result).toEqual(mockCourse);
    });
  });

  describe('getCourseById', () => {
    it('should return a course with instructor', async () => {
      const mockCourse = {
        id: 1,
        title: 'Test Course',
        description: 'Test Description',
        instructorId: 1,
        instructor: {
          id: 1,
          name: 'Test Instructor',
          email: 'instructor@test.com',
        },
      };

      (prisma.course.findUnique as jest.Mock).mockResolvedValue(mockCourse);

      const result = await CourseService.getCourseById(1);

      expect(prisma.course.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { instructor: true },
      });
      expect(result).toEqual(mockCourse);
    });

    it('should return null if course not found', async () => {
      (prisma.course.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await CourseService.getCourseById(999);

      expect(result).toBeNull();
    });
  });

  describe('getCourses', () => {
    it('should return all courses with instructors', async () => {
      const mockCourses = [
        {
          id: 1,
          title: 'Course 1',
          description: 'Description 1',
          instructorId: 1,
          instructor: {
            id: 1,
            name: 'Instructor 1',
            email: 'instructor1@test.com',
          },
        },
        {
          id: 2,
          title: 'Course 2',
          description: 'Description 2',
          instructorId: 2,
          instructor: {
            id: 2,
            name: 'Instructor 2',
            email: 'instructor2@test.com',
          },
        },
      ];

      (prisma.course.findMany as jest.Mock).mockResolvedValue(mockCourses);

      const result = await CourseService.getCourses();

      expect(prisma.course.findMany).toHaveBeenCalledWith({
        include: { instructor: true },
      });
      expect(result).toEqual(mockCourses);
    });
  });

  describe('updateCourse', () => {
    it('should update a course', async () => {
      const mockUpdatedCourse = {
        id: 1,
        title: 'Updated Course',
        description: 'Updated Description',
        instructorId: 1,
      };

      (prisma.course.update as jest.Mock).mockResolvedValue(mockUpdatedCourse);

      const updates = {
        title: 'Updated Course',
        description: 'Updated Description',
      };

      const result = await CourseService.updateCourse(1, updates);

      expect(prisma.course.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updates,
      });
      expect(result).toEqual(mockUpdatedCourse);
    });
  });

  describe('deleteCourse', () => {
    it('should delete a course', async () => {
      const mockDeletedCourse = {
        id: 1,
        title: 'Test Course',
        description: 'Test Description',
        instructorId: 1,
      };

      (prisma.course.delete as jest.Mock).mockResolvedValue(mockDeletedCourse);

      const result = await CourseService.deleteCourse(1);

      expect(prisma.course.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockDeletedCourse);
    });
  });

  describe('getCoursesByInstructor', () => {
    it('should return courses by instructor', async () => {
      const mockCourses = [
        {
          id: 1,
          title: 'Course 1',
          description: 'Description 1',
          instructorId: 1,
        },
        {
          id: 2,
          title: 'Course 2',
          description: 'Description 2',
          instructorId: 1,
        },
      ];

      (prisma.course.findMany as jest.Mock).mockResolvedValue(mockCourses);

      const result = await CourseService.getCoursesByInstructor(1);

      expect(prisma.course.findMany).toHaveBeenCalledWith({
        where: { instructorId: 1 },
      });
      expect(result).toEqual(mockCourses);
    });
  });
});