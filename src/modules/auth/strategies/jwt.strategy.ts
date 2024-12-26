import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import passport from "passport";
import { Account } from "@prisma/client";
import { prisma } from "#/infrastructure/database/prisma";

export const initializeJwtStrategy = async () => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.APP_JWT_SECRET,
      },
      async (
        jwt_payload: { sub: string },
        done: (error: Error | null, account?: Account | false) => void
      ) => {
        try {
          // -- get account by id
          const account = await prisma.account.findFirst({
            where: { id: jwt_payload.sub },
          });

          if (!account) {
            return done(null, false);
          }

          return done(null, account);
        } catch (err) {
          return done(null, false);
        }
      }
    )
  );
};
