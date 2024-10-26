import { Router } from "express";
import { testRouter } from "./modules/test/test.routes";
import { adminAuthRouter } from "./modules/auth/admin/admin-auth.routes";
import { meRouter } from "./modules/me/me.routes";
import { mediaRouter } from "./modules/media/media.routes";
import { customerAuthRouter } from "./modules/auth/customer/customer-auth.routes";

export const apiRouter = Router();
// -- Common
apiRouter.use(mediaRouter);

// -- Auth
apiRouter.use(meRouter);
apiRouter.use(adminAuthRouter);
apiRouter.use(customerAuthRouter);

// -- Business
apiRouter.use(testRouter);
