import { prisma } from "@/src/common/providers/database/prisma";
import { Prisma } from "@prisma/client";
import { add, isAfter } from "date-fns";
import createHttpError from "http-errors";

const create = async ({ accountId }: { accountId: string }) => {
  const session = await prisma.session.create({
    data: {
      expiresAt: add(new Date(), { days: 7 }),
      sessionToken: crypto.randomUUID(),
      accountId: accountId,
    },
  });

  return session;
};

const remove = async ({ where }: { where: Prisma.SessionWhereUniqueInput }) => {
  await prisma.session.delete({
    where,
  });
};

const findByToken = async ({ token }: { token: string }) => {
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
      sessionToken: token,
    },
  });

  if (!session) {
    throw createHttpError.Forbidden(`Session #${token} not found.`);
  }

  return session;
};

const isExpired = async ({ token }: { token: string }) => {
  const session = await prisma.session.findFirst({
    where: {
      sessionToken: token,
    },
  });

  if (!session) {
    return false;
  }

  if (isAfter(new Date(), session.expiresAt)) {
    await remove({
      where: {
        sessionToken: session.id,
      },
    });

    return true;
  }

  return false;
};

export const sessionService = { create, remove, findByToken, isExpired };
