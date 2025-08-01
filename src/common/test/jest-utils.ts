import { prisma } from "../database/prisma";
import { authService } from "../services/auth.service";
import { seedAdminId, seedCustomerId } from "./jest-initialize-db";

/**
 * Get the admin user access token
 * We will need it for some tests that require authentication and role
 * @returns The admin user access token
 */
export const getAdminUserAccessToken = async () => {
  const adminAccount = await prisma.account.findFirst({
    where: {
      admin: {
        id: seedAdminId,
      },
    },
  });

  if (!adminAccount) {
    throw new Error("Admin account not found");
  }

  const { accessToken } = await authService.generateAuthenticationTokens({
    accountId: adminAccount.id,
  });

  return accessToken;
};

/**
 * Get the customer user access token
 * We will need it for some tests that require authentication and role
 * @returns The customer user access token
 */
export const getCustomerUserAccessToken = async () => {
  const customerAccount = await prisma.account.findFirst({
    where: {
      customer: { id: seedCustomerId },
    },
  });

  if (!customerAccount) {
    throw new Error("Customer account not found");
  }

  const { accessToken } = await authService.generateAuthenticationTokens({
    accountId: customerAccount.id,
  });

  return accessToken;
};
