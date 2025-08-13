import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed your database here
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: 'hashed_password', // Remember to hash passwords in production
      name: 'Admin',
      role: 'ADMIN'
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
