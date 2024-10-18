import { Account, Admin, Customer } from "@prisma/client";

export type CustomAccount = Account & {
  admin: Admin;
  customer: Customer;
};

declare global {
  namespace Express {
    interface Request {
      // Overwrite the existing user type with your custom user type
      account: CustomAccount;
    }
  }
}

declare module "express" {
  export interface Request {
    // Overwrite the existing request's user type with your custom user type
    account: CustomAccount;
  }
}

export {};
