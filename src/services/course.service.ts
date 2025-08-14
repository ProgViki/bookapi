import { Course, User } from '@prisma/client';
import prisma from '../utils/prisma';

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

// import prisma from '../utils/prisma';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { ILogin, IRegister } from '../interfaces/user.interface';
// import { User } from '@prisma/client';

// class AuthService {
//   async register(data: IRegister): Promise<User> {
//     const hashedPassword = await bcrypt.hash(data.password, 10);
//     return prisma.user.create({
//       data: {
//         ...data,
//         password: hashedPassword,
//       },
//     });
//   }

//   async login(credentials: ILogin): Promise<{ user: User; token: string }> {
//     const user = await prisma.user.findUnique({
//       where: { email: credentials.email },
//     });

//     if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
//       throw new Error('Invalid email or password');
//     }

//     const token = jwt.sign(
//       { userId: user.id, role: user.role },
//       process.env.JWT_SECRET as string,
//       { expiresIn: '1d' }
//     );

//     return { user, token };
//   }

//   async getUser(id: number): Promise<User | null> {
//     return prisma.user.findUnique({ where: { id } });
//   }

//   async getUserByEmail(email: string): Promise<User | null> {
//     return prisma.user.findUnique({ where: { email } });
//   }

//   async validateToken(token: string): Promise<User | null> {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
//         userId: number;
//       };

//       return prisma.user.findUnique({ where: { id: decoded.userId } });
//     } catch (error) {
//       return null; // Invalid or expired token
//     }
//   }
// }

// export default new AuthService();
