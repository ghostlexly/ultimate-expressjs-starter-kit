import { Router } from "express";
import { meRoutes } from "#/modules/me/routes/me.routes";
import { testRoutes } from "#/modules/test/routes/test.routes";
import { mediaRoutes } from "#/modules/media/routes/media.routes";
import { adminAuthRoutes } from "#/modules/auth/admin/routes/admin-auth.routes";
import { customerAuthRoutes } from "#/modules/auth/customer/routes/customer-auth.routes";

export const apiRouter = Router();
// -- Common
apiRouter.use(mediaRoutes);

// -- Auth
apiRouter.use(meRoutes);
apiRouter.use(adminAuthRoutes);
apiRouter.use(customerAuthRoutes);

// -- Business
apiRouter.use(testRoutes);
