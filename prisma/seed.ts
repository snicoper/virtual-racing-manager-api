import { PrismaClient } from '@prisma/client';
import * as bycrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const passwordHash = await bycrypt.hash('Password123!', 10);

  await prisma.user.create({
    data: {
      email: 'salva@example.com',
      passwordHash: passwordHash,
    },
  });

  await prisma.user.create({
    data: {
      email: 'alice@example.com',
      passwordHash: passwordHash,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
