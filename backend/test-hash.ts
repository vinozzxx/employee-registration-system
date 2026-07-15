import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('No user found');
    return;
  }

  console.log('User:', user.email);
  console.log('Hash in DB:', user.passwordHash);

  // Test password 'SecurePass123' which was from the user's prompt
  const testPassword = 'SecurePass123';
  const isValid = await bcrypt.compare(testPassword, user.passwordHash);
  console.log(`Is '${testPassword}' valid?`, isValid);

  // Also hash 'SecurePass123' to see what it looks like
  const newHash = await bcrypt.hash(testPassword, 12);
  console.log('New hash for SecurePass123:', newHash);
  console.log('Does new hash validate?', await bcrypt.compare(testPassword, newHash));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
