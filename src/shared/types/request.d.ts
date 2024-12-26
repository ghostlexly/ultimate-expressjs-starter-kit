import { Account, Admin, Customer } from "@prisma/client";

export type CustomAccount = Account & {
  admin: Admin;
  customer: Customer;
};

export type Context = {
  account: CustomAccount | undefined;
};

declare global {
  namespace Express {
    interface Request {
      // Add context to the request
      context?: Context | undefined;

      // Get the real ip address from cloudflare or other proxies
      clientIp?: string;
    }
  }
}

export {};
