import { Router } from "express";
import { meRoutes } from "@/modules/me/routes/me.routes";
import { testRoutes } from "@/modules/test/routes/test.routes";
import { mediaRoutes } from "@/modules/media/routes/media.routes";
import { authRoutes } from "@/modules/auth/routes/auth.routes";

export const apiRoutes = Router();

// -- Common
apiRoutes.use(mediaRoutes);

// -- Auth
apiRoutes.use(meRoutes);
apiRoutes.use(authRoutes);

// -- Business
apiRoutes.use(testRoutes);
