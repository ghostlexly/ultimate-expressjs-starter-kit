import { HttpError } from "@/common/lib/errors";
import { prisma } from "@/common/providers/database/prisma";
import { Prisma } from "@prisma/client";
import { add, isAfter } from "date-fns";

export class SessionService {
  async create({ accountId }: { accountId: string }) {
    const session = await prisma.session.create({
      data: {
        expiresAt: add(new Date(), { days: 7 }),
        token: crypto.randomUUID(),
        accountId: accountId,
      },
    });

    return session;
  }

  async remove({ where }: { where: Prisma.SessionWhereUniqueInput }) {
    await prisma.session.delete({
      where,
    });
  }

  async findByToken({ token }: { token: string }) {
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
      throw new HttpError({
        status: 403,
        body: `Session #${token} not found.`,
      });
    }

    return session;
  }

  async isExpired({ token }: { token: string }) {
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
  }
}
