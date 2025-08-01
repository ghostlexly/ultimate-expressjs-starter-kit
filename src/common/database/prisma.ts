import { Prisma, PrismaClient } from "@/generated/prisma/client";
import { s3Service } from "../storage/s3";

export type ExtendedPrismaClient = typeof prisma;

export type PrismaTransactionClient = Omit<
  ExtendedPrismaClient,
  "$extends" | "$transaction" | "$disconnect" | "$connect" | "$on" | "$use"
>;

const prisma = new PrismaClient()
  .$extends({
    model: {
      $allModels: {
        async findManyAndCount<Model, Args>(
          this: Model,
          args: Prisma.Exact<Args, Prisma.Args<Model, "findMany">>
        ): Promise<{
          data: Prisma.Result<Model, Args, "findMany">;
          count: number;
        }> {
          const [data, count] = await Promise.all([
            (this as any).findMany(args),
            (this as any).count({ where: (args as any).where }),
          ]);

          return { data, count };
        },
      },
    },
  })

  .$extends({
    query: {
      media: {
        delete: async ({ args, query }) => {
          // -- Fetch the media record to get the key
          const media = await prisma.media.findUnique({
            where: { id: args.where.id },
          });

          // -- Run the query and throw an error if the query fails
          const queryResult = await query(args);

          // -- The record was deleted successfully...
          if (media) {
            // Delete the file from S3
            await s3Service.deleteFile({ key: media.key });
          }

          return queryResult;
        },
      },
    },
  });

export { prisma };
