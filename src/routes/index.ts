import {
  type Request,
  type Response,
  type NextFunction,
  Router,
} from "express";
import pingRoutes from "../ping/ping.routes.ts";
import { adminController } from "../controllers/admin.controller.ts";
import devicesRoutes from "./devices.routes.ts";
import { requireDeviceKey } from "../middlewares/auth.middleware.ts";
import { postTelemetry } from "../controllers/telemetry.controller.ts";
import { getDeviceMe } from "../controllers/devices.controller.ts";

const router = Router();

router.use(pingRoutes);
router.use("/devices",devicesRoutes);
router.get("/devices/me", requireDeviceKey, getDeviceMe);
router.post("/telemetry", requireDeviceKey, postTelemetry);

const checkAdminApiKey = (req: Request, res: Response, next: NextFunction) => {
  const adminApiKey = req.headers["x-api-key"];
  if (adminApiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

const adminRoutes = Router();
adminRoutes.get(
  "/admin/devices",
  checkAdminApiKey,
  adminController.listDevices,
);
adminRoutes.get(
  "/admin/devices/:deviceId",
  checkAdminApiKey,
  adminController.getDevice,
);
adminRoutes.get(
  "/admin/devices/:deviceId/telemetry",
  checkAdminApiKey,
  adminController.getTelemetry,
);

adminRoutes.post(
  "/admin/devices/:deviceId/approve",
  checkAdminApiKey,
  adminController.approveDevice,
);

adminRoutes.post(
  "/admin/devices/:deviceId/revoke",
  checkAdminApiKey,
  adminController.deleteDevice,
);

router.use(adminRoutes);

export default router;
