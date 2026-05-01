import {
  type Request,
  type Response,
  type NextFunction,
  Router,
} from "express";
import { adminController } from "../controllers/admin.controller.ts";

const adminRoutes = Router();

const checkAdminApiKey = (req: Request, res: Response, next: NextFunction) => {
  const adminApiKey = req.headers["x-api-key"];
  if (adminApiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

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
adminRoutes.get(
  "/admin/devices/:deviceId/telemetry/latest",
  checkAdminApiKey,
  adminController.getLatestTelemetry,
);
adminRoutes.get(
  "/admin/devices/:deviceId/stats",
  checkAdminApiKey,
  adminController.getStats,
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

export default adminRoutes;
