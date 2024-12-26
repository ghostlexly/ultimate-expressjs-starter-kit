import {
  AbilityBuilder,
  AbilityTuple,
  MongoAbility,
  MongoQuery,
  createMongoAbility,
} from "@casl/ability";
import { CustomAccount } from "#/shared/types/request";
import { Request, Response, NextFunction } from "express";
import { HttpException } from "#/shared/exceptions/http-exception";

/**
 * Define the abilities of the given account.
 * @param account
 * @returns
 */
const defineAbilitiesFor = async (account: CustomAccount | null) => {
  const abilities = new AbilityBuilder(createMongoAbility);

  if (account?.role === "ADMIN") {
    abilities.can("manage", "all"); // Can do anything
  } else if (account?.role === "CUSTOMER") {
    await customerAbilities(account, abilities);
  }

  return abilities.build({
    detectSubjectType: (object) => object.type,
  });
};

/**
 * Define the abilities of the housekeeper.
 * @param account
 * @param abilities
 * @returns
 */
const customerAbilities = async (
  account: CustomAccount,
  abilities: AbilityBuilder<MongoAbility<AbilityTuple, MongoQuery>>
) => {
  // ADD ABILITIES HERE...
  //
  // @EXAMPLE 1 --
  // --
  // const housekeeperInformations = await prisma.housekeeperInformation.findFirst(
  //   {
  //     where: {
  //       ownerId: account.housekeeper.id,
  //     },
  //   }
  // );
  //
  // if (housekeeperInformations) {
  //   abilities.can(["read", "update"], "housekeeper-informations", ["id"], {
  //     id: housekeeperInformations.id,
  //   });
  // } else {
  //   abilities.can(["create"], "housekeeper-informations");
  // }
  //
  // @EXAMPLE 2 --
  // const housekeeperBankAccounts = await prisma.housekeeperBankAccount.findMany({
  //   where: {
  //     ownerId: account.housekeeper.id,
  //   },
  // });
  //
  // abilities.can(["create", "read"], "housekeeper-bank-account");
  //
  // for (const bankAccount of housekeeperBankAccounts) {
  //   abilities.can(["update", "delete"], "housekeeper-bank-account", ["id"], {
  //     id: bankAccount.id,
  //   });
  // }
};

/**
 * Check if the current logged-in user has the required abilities.
 * @param param0
 */
export const checkAbilities = async ({
  req,
  method,
  type,
  object,
  throwError = false,
}: {
  req: Request;
  method: string;
  type: string;
  object?: any;
  throwError?: boolean;
}) => {
  const abilities = await defineAbilitiesFor(req.context?.account || null);

  if (
    abilities.cannot(method, {
      type: type,
      ...object,
    })
  ) {
    if (throwError) {
      throw new HttpException({
        status: 403,
        message: "You are not allowed to access this resource.",
      });
    } else {
      return false;
    }
  }

  return true;
};

/**
 * Get the abilities of the current logged-in user programatically.
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const getAbilities = (req: Request) => {
  if (!req.context?.account) {
    throw new HttpException({
      status: 403,
      message: "You must be logged in to access this resource.",
    });
  }

  return defineAbilitiesFor(req.context?.account);
};

/**
 * Check if the current logged-in user has the required abilities.
 * @param method : method name (read, create, update, delete)
 * @param type : type of the resource (housekeeper-informations, housekeeper-avatar, housekeeper-document)
 * @param object : object to check (optional) (id, ownerId, etc.)
 * @returns
 */
export const abilitiesGuard =
  ({
    method,
    type,
    object,
  }: {
    method: string;
    type: string;
    object?: (req: Request) => any;
  }) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // Evaluating 'object' option to dynamically build the verification object
    // If 'object' is a function, evaluate it with 'req' to get the object
    const objectToCheck = typeof object === "function" ? object(req) : object;

    try {
      const hasAccess = await checkAbilities({
        req,
        method,
        type,
        object: objectToCheck,
      });

      if (!hasAccess) {
        throw new HttpException({
          status: 403,
          message: "You are not allowed to access this resource.",
        });
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
