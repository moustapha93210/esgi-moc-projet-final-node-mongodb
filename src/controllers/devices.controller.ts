import { type Request, type Response } from "express";
import { randomUUID } from "crypto";
import {
  createDevice,
  deleteDevice,
  findDeviceByDeviceId,
  findDeviceByDeviceAccessKey,
} from "../repositories/devices.repository.ts";
import { DeviceSchema } from "../schema/devices.schema.ts";
import type { Device } from "../types.ts";

export const postDevicesRegister = async (req: Request, res: Response) => {
  try {
    // Récupérer les données de la requête
    const parsed = DeviceSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: "Invalid input",
        errors: parsed.error.issues,
      });
      return;
    }
    const { deviceId, name, type } = parsed.data;
    // Vérifier si le device existe déjà
    const existing = await findDeviceByDeviceId(deviceId);
    //console.log("Device existant ? ", existing);

    if (existing) {
      await deleteDevice(existing.deviceId);
    }

    const uuid = randomUUID();

    const newDevice: Device = {
      deviceId,
      name,
      type,
      deviceAccessKey: uuid,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insertion du nouveau device dans la base de données
    await createDevice(newDevice);

    const response = res.status(201).json({
      deviceId: newDevice.deviceId,
      deviceAccessKey: newDevice.deviceAccessKey,
      status: newDevice.status,
    });

    return response;
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Permet au device de consulter son propre status avec sa deviceAccessKey
export const getDeviceMe = async (req: Request, res: Response) => {
  try {
    // Récupérer la clé depuis le header x-device-key
    const deviceRecuperated = req.get("x-device-key");

    // Vérifier que le header existe
    if (!deviceRecuperated) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Chercher le device en base avec cette clé
    const existing = await findDeviceByDeviceAccessKey(deviceRecuperated);

    if (existing) {
      // Un device révoqué ne peut plus consulter son status
      if (existing.status === "revoked") {
        res.status(403).json({ message: "Forbidden" });
        return;
      }
      // On retourne uniquement les champs nécessaires — pas la deviceAccessKey
      res.status(200).json({
        deviceId: existing.deviceId,
        name: existing.name,
        type: existing.type,
        status: existing.status,
      });
      return;
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
