import { Router } from "express";
import { adminAuthRoutes } from "./features/auth/admin/routes/admin-auth.routes";
import { meRoutes } from "./features/me/routes/me.routes";
import { customerAuthRoutes } from "./features/auth/customer/routes/customer-auth.routes";
import { testRoutes } from "./features/test/routes/test.routes";
import { mediaRoutes } from "./features/media/routes/media.routes";

export const apiRouter = Router();
// -- Common
apiRouter.use(mediaRoutes);

// -- Auth
apiRouter.use(meRoutes);
apiRouter.use(adminAuthRoutes);
apiRouter.use(customerAuthRoutes);

// -- Business
apiRouter.use(testRoutes);
