import { Router } from "express";
import { testRoutes } from "./modules/test/test.routes";
import { adminAuthRoutes } from "./modules/auth/admin/admin-auth.routes";
import { meRoutes } from "./modules/me/me.routes";
import { mediaRoutes } from "./modules/media/media.routes";
import { customerAuthRoutes } from "./modules/auth/customer/customer-auth.routes";

export const apiRouter = Router();
// -- Common
apiRouter.use(mediaRoutes);

// -- Auth
apiRouter.use(meRoutes);
apiRouter.use(adminAuthRoutes);
apiRouter.use(customerAuthRoutes);

// -- Business
apiRouter.use(testRoutes);
