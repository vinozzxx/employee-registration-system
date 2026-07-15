import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('USERS IN DB:', users.length);
  for (const u of users) {
    console.log(u.email, u.passwordHash.substring(0, 10));
  }
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
