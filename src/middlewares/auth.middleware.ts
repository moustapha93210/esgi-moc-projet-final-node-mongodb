import type { Request, Response, NextFunction } from "express";
import type { Device
 } from "../types.ts";
import { findDeviceByDeviceAccessKey } from "../repositories/devices.repository.ts";

export const requireDeviceKey = async (req: Request, res: Response, next: NextFunction) => {
  // Récupérer la clé depuis le header x-device-key
  const deviceAccessKey = req.headers["x-device-key"] as string | undefined;
  if (!deviceAccessKey) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  // Chercher le device en base avec cette clé
  const device = await findDeviceByDeviceAccessKey(deviceAccessKey);

  if (!device) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (device.status === "revoked") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  (req as Request & { device: Device }).device = device;
  next();
};