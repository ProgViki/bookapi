import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash sample passwords
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create sample users (some instructors, some students)
  const instructor1 = await prisma.user.create({
    data: {
      name: 'Alice Instructor',
      email: 'alice@example.com',
      password: passwordHash,
      role: 'INSTRUCTOR', // Ensure your User model has a `role` field
    },
  });

  const instructor2 = await prisma.user.create({
    data: {
      name: 'Bob Instructor',
      email: 'bob@example.com',
      password: passwordHash,
      role: 'INSTRUCTOR',
    },
  });

  const student1 = await prisma.user.create({
    data: {
      name: 'Charlie Student',
      email: 'charlie@example.com',
      password: passwordHash,
      role: 'STUDENT',
    },
  });

  // Create sample courses
  await prisma.course.createMany({
    data: [
      {
        title: 'Introduction to JavaScript',
        description: 'Learn the basics of JavaScript, the language of the web.',
        instructorId: instructor1.id,
      },
      {
        title: 'Advanced TypeScript',
        description: 'Master TypeScript for scalable and maintainable applications.',
        instructorId: instructor1.id,
      },
      {
        title: 'Database Design Fundamentals',
        description: 'Understand database schema design and normalization.',
        instructorId: instructor2.id,
      },
    ],
  });

  console.log('✅ Database has been seeded successfully!');
}

main()
  .catch((err) => {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
