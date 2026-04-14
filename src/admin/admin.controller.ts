import type { Request, Response } from "express";
import { findDeviceByDeviceId } from "../repositories/devices.repository.ts";
import { findAllDevices } from "../repositories/devices.repository.ts";
import { updateDevice } from "../repositories/devices.repository.ts";

export const adminController = {
  async listDevices(_req: Request, res: Response) {
    try {
     
      const statusFilter = _req.query.status as string;

  
        if (
          statusFilter &&
          !["pending", "active", "revoked"].includes(statusFilter)
        ) {
          return res.status(400).json({ message: "Invalid status" });
        }
        const devices = await findAllDevices(statusFilter);
        res.json(devices);
      } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  async approveDevice(req: Request, res: Response) {
    try {
      const { deviceId } = req.params;
      const sucess = await updateDevice(deviceId, {
        status: "active",
        updatedAt: new Date(),
      });

      if (!sucess) {
        return res.status(404).json({ message: "Device not found" });
      }
      return res.json({ ok: true, status: "active" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
async getDevice(req: Request, res: Response) {
  try{
    const { deviceId } = req.params;
    const device = await findDeviceByDeviceId(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found"});
    } 
    res.json(device);
  } catch (error) {

    res.status(500).json({ message: "Erreur serveur" });
  }
},
  async deleteDevice(req: Request, res: Response) {
    try {
      const { deviceId } = req.params;
      const sucess = await updateDevice(deviceId, {
        status: "revoked",
        updatedAt: new Date(),
      });
      if (!sucess) {
        return res.status(404).json({ message: "Device not found" });
      }
      return res.json({ ok: true, status: "revoked" });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
};
