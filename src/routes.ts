import { Router } from "express";
import { testRouter } from "./modules/test/test.routes";
import { adminAuthRouter } from "./modules/auth/admin/admin-auth.routes";
import { meRouter } from "./modules/me/me.routes";
import { mediaRouter } from "./modules/media/media.routes";
import { customerAuthRouter } from "./modules/auth/customer/customer-auth.routes";

export const apiRouter = Router();
// -- Common
apiRouter.use("/media", mediaRouter);

// -- Auth
apiRouter.use("/me", meRouter);
apiRouter.use("/admin/auth", adminAuthRouter);
apiRouter.use("/customer/auth", customerAuthRouter);

// -- Business
apiRouter.use("/tests", testRouter);
