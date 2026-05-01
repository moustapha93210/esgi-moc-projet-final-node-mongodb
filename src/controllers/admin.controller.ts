import type { Request, Response } from "express";
import { findDeviceByDeviceId } from "../repositories/devices.repository.ts";
import { findAllDevices } from "../repositories/devices.repository.ts";
import { updateDevice } from "../repositories/devices.repository.ts";
import { findLatestTelemetry, findTelemetryByDeviceId, findTelemetryStats } from "../repositories/telemetry.repository.ts";

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

async getTelemetry(req: Request, res: Response) {
  try {
    const { deviceId } = req.params;

    const device = await findDeviceByDeviceId(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found"});
    }
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const offset = Number(req.query.offset) || 0;

    const { data, total } = await findTelemetryByDeviceId(deviceId, limit, offset);
    res.json({ data, pagination: { total, limit, offset }});
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
},

async getLatestTelemetry(req: Request, res: Response) {

  try {
    const { deviceId} = req.params;
    const device = await findDeviceByDeviceId(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found"});
    }
    const latest = await findLatestTelemetry(deviceId);
    if (!latest) {
      return res.status(404).json({ message: "No telemetry found for this device"});
    }
    res.json(latest);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }

},


async getStats(req: Request, res: Response) {
  try {
    const { deviceId } = req.params;
    const device = await findDeviceByDeviceId(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
}

const from = new Date(req.query.from as string || 0 );
const to = new Date(req.query.to as string || Date.now());

const stats = await findTelemetryStats(deviceId, from, to);

if (device.type === "climate") {
  return res.json({
    from: from.toISOString(),
    to: to.toISOString(),
    count: stats.count,
    temperature: {
      min: stats.tempMin,
      max: stats.tempMax,
      avg: stats.tempAvg
    },
    humidity: {
      min: stats.humMin, 
      max: stats.humMax,
      avg: stats.humAvg
    },
  });
}
 else {
  return res.json({
    from: from.toISOString(),
    to: to.toISOString(),
    count: stats.count,
    motionDetected: stats.motionDetected,
  });
}
} catch (error) {
  res.status(500).json({ message: "Erreur serveur" });
}

}

};


