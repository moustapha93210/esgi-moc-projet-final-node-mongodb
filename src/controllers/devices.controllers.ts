import { type Request, type Response } from "express";
import { type DeviceType, type DeviceStatus, type Device } from "../type.ts";
import { randomUUID } from "crypto";
import { createDevice, deleteDevice, findDeviceByDeviceId,  findDeviceByDeviceAccessKey} from "../repositories/devices.repository.ts";
import { type DeviceSchemaInput } from "../schema/device.schema.ts";

// POST /devices/register
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
    //console.log("Device existe ?: ", existing);

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

  } catch(error) {
        
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
  }
};



// GET /register/devices/Me
export const getDeviceMe = async (req: Request, res: Response) => {
    try {

        const headerRecuperated = req.get("x-device-key");

        // Vérifier que le header existe
        if(!headerRecuperated)
        {
            return res.status(401).json({ message: "Unauthorized" });
        }


        const existing = await findDeviceByDeviceAccessKey(headerRecuperated);
        //console.log("existing: ", existing);

        if(!existing)
        {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if(existing.status === "revoked")
        {
            return res.status(403).json({ message: "Forbidden" });
        }

        const response = res.status(200).json({
          deviceId: existing.deviceId,
          name: existing.name,
          type: existing.type,
          status: existing.status
        });

        return response;

    } catch(error) {
        
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

};