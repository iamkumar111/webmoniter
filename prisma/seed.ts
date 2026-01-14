import { PrismaClient, Role, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const initialPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Strong_Def@ult_2026!#';
  const hashedPassword = await bcrypt.hash(initialPassword, 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'iamkumar111@gmail.com' },
    update: {},
    create: {
      email: 'iamkumar111@gmail.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  console.log('Super admin created/verified:', superAdmin.email);

  await prisma.systemSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      defaultInterval: 5,
      defaultTimeout: 30,
      defaultFailureThreshold: 1,
      defaultRecoveryThreshold: 1,
    },
  });

  console.log('Default system settings created/verified');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
