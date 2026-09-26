import { PrismaClient, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@sneakerhead.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
    create: {
      email: adminEmail,
      name: "Super Admin",
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
  });

  const customerPasswordHash = await bcrypt.hash("Customer123!", 12);

  const sampleCustomers = [
    {
      email: "jane@example.com",
      name: "Jane Customer",
      status: UserStatus.ACTIVE,
    },
    {
      email: "pending@example.com",
      name: "Pending User",
      status: UserStatus.PENDING_VERIFICATION,
    },
    {
      email: "disabled@example.com",
      name: "Disabled User",
      status: UserStatus.DISABLED,
    },
  ];

  for (const customer of sampleCustomers) {
    await prisma.user.upsert({
      where: { email: customer.email },
      update: {
        name: customer.name,
        status: customer.status,
        role: UserRole.CUSTOMER,
        passwordHash: customerPasswordHash,
      },
      create: {
        email: customer.email,
        name: customer.name,
        status: customer.status,
        role: UserRole.CUSTOMER,
        passwordHash: customerPasswordHash,
        emailVerified: customer.status === UserStatus.ACTIVE,
      },
    });
  }

  console.log(`Seeded admin user: ${adminEmail}`);
  console.log("Seeded sample customers: jane@example.com / Customer123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
