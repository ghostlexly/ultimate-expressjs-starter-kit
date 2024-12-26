import { HttpException } from "#/shared/exceptions/http-exception";
import { prisma } from "#/infrastructure/database/prisma";
import { Prisma } from "@prisma/client";
import { add, isAfter } from "date-fns";

export class SessionService {
  create = async ({ accountId }: { accountId: string }) => {
    const session = await prisma.session.create({
      data: {
        expiresAt: add(new Date(), { days: 7 }),
        token: crypto.randomUUID(),
        accountId: accountId,
      },
    });

    return session;
  };

  remove = async ({ where }: { where: Prisma.SessionWhereUniqueInput }) => {
    await prisma.session.delete({
      where,
    });
  };

  findByToken = async ({ token }: { token: string }) => {
    const session = await prisma.session.findUnique({
      include: {
        account: {
          include: {
            admin: true,
            customer: true,
          },
        },
      },
      where: {
        token: token,
      },
    });

    if (!session) {
      throw new HttpException({
        status: 403,
        message: `Session #${token} not found.`,
      });
    }

    return session;
  };

  isExpired = async ({ token }: { token: string }) => {
    const session = await prisma.session.findFirst({
      where: {
        token: token,
      },
    });

    if (!session) {
      return false;
    }

    if (isAfter(new Date(), session.expiresAt)) {
      await this.remove({
        where: {
          id: session.id,
        },
      });

      return true;
    }

    return false;
  };
}

export const sessionService = new SessionService();
