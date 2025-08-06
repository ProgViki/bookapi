import prisma from '../utils/prisma';
import { Course, User } from '@prisma/client';

class CourseService {
  async createCourse(title: string, description: string, instructorId: number): Promise<Course> {
    return prisma.course.create({
      data: {
        title,
        description,
        instructorId,
      },
    });
  }

  async getCourseById(id: number): Promise<Course & { instructor: User }> {
    return prisma.course.findUnique({
      where: { id },
      include: { instructor: true },
    });
  }

  async getCourses(): Promise<(Course & { instructor: User })[]> {
    return prisma.course.findMany({
      include: { instructor: true },
    });
  }

  async updateCourse(id: number, updates: Partial<Course>): Promise<Course> {
    return prisma.course.update({
      where: { id },
      data: updates,
    });
  }

  async deleteCourse(id: number): Promise<Course> {
    return prisma.course.delete({
      where: { id },
    });
  }

  async getCoursesByInstructor(instructorId: number): Promise<Course[]> {
    return prisma.course.findMany({
      where: { instructorId },
    });
  }
}

export default new CourseService();