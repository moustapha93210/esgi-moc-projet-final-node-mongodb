import type { Request, Response } from "express";
import type { Device, Telemetry } from "../types.ts"
import { climateTelemetrySchema, presenceTelemetrySchema } from "../schema/telemetry.schema.ts";
import { createTelemetry } from "../repositories/telemetry.repository.ts";


// POST telemetry

export const postTelemetry = async (req: Request, res: Response) => {

    try {
    const device = (req as Request & { device: Device}).device;

        if (device.status !== "active") {
             res.status(403).json({ message: "Forbidden" });
             return;
        }

        let schema;
        if(device.type === "climate") {
            schema = climateTelemetrySchema;
        }
        else {
            schema = presenceTelemetrySchema;
        }

       const validationResult = schema.safeParse(req.body);
       if(!validationResult.success) {
        res.status(400).json({ message: "Invalid input", errors: validationResult.error.issues})
       return;
    }     

  const newTelemetry : Telemetry = {
    deviceId: device.deviceId,
    timestamp: new Date(validationResult.data.timestamp),
    battery: validationResult.data.battery,
  };

  if (device.type === "climate") {
    newTelemetry.temperature = (validationResult.data as { temperature: number}).temperature;
    newTelemetry.humidity = (validationResult.data as { humidity: number}).humidity;    
    } else {
        newTelemetry.motion = (validationResult.data as { motion: boolean}).motion;
    }
  
    await createTelemetry(newTelemetry);
    res.status(201).json({ ok : true });

} catch {
    res.status(500).json({ error: "Internal Server Error" });
}
};



    




