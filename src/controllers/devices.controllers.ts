import { type Request, type Response } from "express";
import { type DeviceType, type DeviceStatus, type Device } from "../type.ts";
import { randomUUID } from "crypto";
import { createDevice, deleteDevice, findDeviceByDeviceId,  findDeviceByDeviceAccessKey} from "../repositories/devices.repository.ts";
import { z } from "zod";
import { type DeviceSchemaInput } from "../schema/device.schema.ts";

export const postDevicesRegister = async (req: Request, res: Response) => {
  try {

    // Récupérer les données de la requête
    const deviceRecuperated: DeviceSchemaInput = {
      deviceId: req.body.deviceId,
      name: req.body.name,
      type: req.body.type,
    };

    // Vérifier si le device existe déjà
    const existing = await findDeviceByDeviceId(deviceRecuperated.deviceId);
    //console.log("Device existant ? ", existing);

    if (existing) {

      await deleteDevice(existing.deviceId);

    }

    const uuid = randomUUID();

    const newDevice: Device = {
      deviceId: deviceRecuperated.deviceId,
      name: deviceRecuperated.name,
      type: deviceRecuperated.type,
      deviceAccessKey: uuid,
      status: "pending",
      createdAt: new Date(),
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

export const getDeviceMe = async (req: Request, res: Response) => {
    try {

        const deviceRecuperated = req.get("x-device-key");

        // Vérifier que le header existe
        if(!deviceRecuperated)
        {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const existing = await findDeviceByDeviceAccessKey(deviceRecuperated);

        if(existing)
        {
            const response = res.status(200).
        }


    } catch {
        
    }

};