import { Router } from "express";
import pingRoutes from "../ping/ping.routes.ts";
import { adminController } from "../admin/admin.controller.ts";
import { devicesController } from "../devices/devices.controller.ts";

const router = Router();

router.use(pingRoutes);

router.post("/devices/register", devicesController.register);

const checkAdminApiKey = (req, res, next) => {
  const adminApiKey = req.headers["x-admin-api-key"];
  if (adminApiKey !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

const adminRoutes = Router();
adminRoutes.get(
  "/admin/devices",
  checkAdminApiKey,
  adminController.listDevices,
);
adminRoutes.post(
  "/admin/devices/:deviceId/approve",
  checkAdminApiKey,
  async (req, res) => {
    res.json({ ok: true });
  },
);

router.use(adminRoutes);

export default router;
