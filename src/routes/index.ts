import { type Request, type Response, type NextFunction, Router } from "express";
import { checkAdminApiKey } from "../middlewares/auth.middleware.ts";
import pingRoutes from "./ping.routes.ts";
import devicesRoutes from "./devices.routes.ts";
import telemetryRoutes from "./telemetry.routes.ts";
import adminRoutes from "./admin.routes.ts";


const router = Router();


router.use(pingRoutes);

// Monte toutes les routes liées aux devices sur le préfixe /devices
router.use("/devices", devicesRoutes);

//  Monte les routes de télémétrie sur le préfixe /telemetry
router.use("/telemetry", telemetryRoutes);

//  Monte les routes de l'admin sur le préfixe /admin
router.use("/admin/devices", checkAdminApiKey, adminRoutes);




export default router;
