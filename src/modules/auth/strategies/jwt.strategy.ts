import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { Account } from "@/generated/prisma/client";
import { prisma } from "@/common/database/prisma";
import { env } from "@/config";

export const initializeJwtStrategy = async () => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        algorithms: ["RS256"], // Recommended algorithm for JWT (Asymmetric, uses a private key to sign and a public key to verify.). The default one is HS256 (Symmetric, uses a single secret key for both signing and verifying).
        secretOrKey: Buffer.from(env.APP_JWT_PUBLIC_KEY, "base64").toString(
          "utf8"
        ),
      },
      async (
        payload: { sub: string },
        done: (error: Error | null, account?: Account | false) => void
      ) => {
        try {
          const sessionId = payload.sub;

          // Get account by id
          const account = await prisma.account.findFirst({
            include: {
              admin: true,
              customer: true,
            },
            where: { sessions: { some: { id: sessionId } } },
          });

          if (!account) {
            return done(null, false);
          }

          return done(null, account);
        } catch {
          return done(null, false);
        }
      }
    )
  );
};
