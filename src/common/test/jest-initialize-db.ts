import { prisma } from "../database/prisma";
import { authService } from "../services/auth.service";

export const initializeTestDb = async () => {
  await cleanupTestDb();

  await seedTestDb();
};

const cleanupTestDb = async () => {
  // Delete in reverse order of dependencies to avoid foreign key conflicts
  const tables = [
    // Customers
    "Customer",

    // Admins
    "Admin",

    // Sessions (should be the last)
    "Session",
    "Account",
  ];

  // Delete all tables in a transaction
  await prisma.$transaction(tables.map((table) => prisma[table].deleteMany()));
};

export const seedCustomerId = "dada5771-b561-4dd6-9118-13543ae35169";
export const seedAdminId = "826b57af-f17b-4eb8-9302-a743b1b1e707";

const seedAdmin = async () => {
  const hashedPassword = await authService.hashPassword({
    password: "password",
  });

  await prisma.admin.create({
    data: {
      id: seedAdminId,
      email: "contact@lunisoft.fr",
      password: hashedPassword,
      account: {
        create: {
          role: "ADMIN",
        },
      },
    },
  });
};

const seedCustomer = async () => {
  const hashedPassword = await authService.hashPassword({
    password: "password",
  });

  // Seed Customer
  await prisma.customer.create({
    data: {
      id: seedCustomerId,
      email: "customer@lunisoft.fr",
      password: hashedPassword,
      account: {
        create: {
          role: "CUSTOMER",
        },
      },
    },
  });
};

const seedTestDb = async () => {
  // Seed Admin
  await seedAdmin();

  // Seed Customer
  await seedCustomer();
};
