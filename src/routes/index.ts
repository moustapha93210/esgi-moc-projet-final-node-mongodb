import { Router } from "express";
import pingRoutes from "../ping/ping.routes.ts";
import devicesRoutes from "./devices.routes.ts";
import adminRoutes from "./admin.routes.ts";
import telemetryRoutes from "./telemetry.routes.ts";
import { requireDeviceKey } from "../middlewares/auth.middleware.ts";
import { getDeviceMe } from "../controllers/devices.controller.ts";

const router = Router();

router.use(pingRoutes);
router.use("/devices", devicesRoutes);
router.get("/devices/me", requireDeviceKey, getDeviceMe);
router.use(telemetryRoutes);
router.use(adminRoutes);

export default router;
