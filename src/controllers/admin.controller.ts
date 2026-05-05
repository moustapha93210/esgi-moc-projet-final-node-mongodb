import type { Request, Response } from "express";
import { findDeviceByDeviceId } from "../repositories/devices.repository.ts";
import { findAllDevices } from "../repositories/devices.repository.ts";
import { updateDevice } from "../repositories/devices.repository.ts";
import { findLatestTelemetry, findTelemetryByDeviceId, findTelemetryStats } from "../repositories/telemetry.repository.ts";

export const adminController = {
  // Retourne la liste des devices avec un filtre optionnel sur le status
  async listDevices(_req: Request, res: Response) {
    try {
      const statusFilter = _req.query.status as string;
      // Vérifier que le status est valide avant de requêter MongoDB
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
  // Approuve un device — passe son status de pending à active
  async approveDevice(req: Request, res: Response) {
    try {
      // updateDevice retourne null si le device n'existe pas
      const deviceId = req.params.deviceId as string;
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
  // Retourne les détails d'un device spécifique
  async getDevice(req: Request, res: Response) {
    try {
      const deviceId = req.params.deviceId as string;
      const device = await findDeviceByDeviceId(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      res.json(device);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  // Révoque un device — passe son status à revoked
  async deleteDevice(req: Request, res: Response) {
    try {
      const deviceId = req.params.deviceId as string;
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
  // Retourne les mesures paginées d'un device
  async getTelemetry(req: Request, res: Response) {
    try {
      const deviceId = req.params.deviceId as string;

      const device = await findDeviceByDeviceId(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      const limit = Math.min(Number(req.query.limit) || 20, 100);
      const offset = Number(req.query.offset) || 0;

      const { data, total } = await findTelemetryByDeviceId(
        deviceId,
        limit,
        offset,
      );
      res.json({ data, pagination: { total, limit, offset } });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  },

  async getLatestTelemetry(req: Request, res: Response) {
    try {
      const deviceId = req.params.deviceId as string;
      const device = await findDeviceByDeviceId(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      const latest = await findLatestTelemetry(deviceId);
      if (!latest) {
        return res
          .status(404)
          .json({ message: "No telemetry found for this device" });
      }
      res.json(latest);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
  // Retourne les statistiques agrégées selon le type du device
  async getStats(req: Request, res: Response) {
    try {
      const deviceId = req.params.deviceId as string;
      const device = await findDeviceByDeviceId(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      // Si from/to non fournis — on prend toute la période disponible
      const from = new Date((req.query.from as string) || 0);
      const to = new Date((req.query.to as string) || Date.now());

      const stats = await findTelemetryStats(deviceId, from, to);
      // La réponse diffère selon le type du device
      if (device.type === "climate") {
        return res.json({
          from: from.toISOString(),
          to: to.toISOString(),
          count: stats.count,
          temperature: {
            min: stats.tempMin,
            max: stats.tempMax,
            avg: stats.tempAvg,
          },
          humidity: {
            min: stats.humMin,
            max: stats.humMax,
            avg: stats.humAvg,
          },
        });
      } else {
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
  },
};


