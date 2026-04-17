import { type Request, type Response } from "express";
import { type Telemetry } from "../type.ts";
import { createTelemetry } from "../repositories/telemetry.repository.ts";
import { findDeviceByDeviceAccessKey } from "../repositories/devices.repository.ts";
import { TelemetrySchemaClimate, TelemetrySchemaPresence } from "../schema/telemetry.schema.ts";



// POST /telemetry
export const postTelemetry = async (req: Request, res: Response) => {

    try {
        
        const headerRecuperated = req.get("x-device-key");

        // Vérifier que le header existe
        if(!headerRecuperated)
        {
            return res.status(401).json({ message: "Unauthorized" });
        }


        const existing = await findDeviceByDeviceAccessKey(headerRecuperated);
        console.log("existing: ", existing);

        if(!existing)
        {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if(existing.status === "revoked" || existing.status === "pending")
        {
            return res.status(403).json({ message: "Forbidden" });
        }



        if(existing.type === "climate")
        {
            const resultClimate =  TelemetrySchemaClimate.safeParse(req.body);

            if(!resultClimate.success)
            {
                return res.status(400).json({
                    message: "Bad Request",
                    errors: resultClimate.error.flatten().fieldErrors,
                });
            }

            const telemetryRecuperated: TelemetrySchemaClimate = {
                timestamp: resultClimate.data.timestamp,
                temperature: resultClimate.data.temperature,
                humidity: resultClimate.data.humidity,
                battery: resultClimate.data.battery
            };


            const newTelemetry: Telemetry = {
                deviceId: existing.deviceId,
                timestamp: new Date(telemetryRecuperated.timestamp),
                temperature: telemetryRecuperated.temperature,
                humidity: telemetryRecuperated.humidity,
                battery: telemetryRecuperated.battery
            };

            const telemetryBdd = await createTelemetry(newTelemetry);
            console.log(telemetryBdd);


            return res.status(201).json({ "ok": true });
            
        }
        else if(existing.type === 'presence')
        {
            const resultPresence =  TelemetrySchemaPresence.safeParse(req.body);

            if(!resultPresence.success)
            {
                return res.status(400).json({
                    message: "Bad Request",
                    errors: resultPresence.error.flatten().fieldErrors,
                });
            }

            const telemetryRecuperated: TelemetrySchemaPresence = {
                timestamp: resultPresence.data.timestamp,
                motion: resultPresence.data.motion,
                battery: resultPresence.data.battery
            };


            const newTelemetry: Telemetry = {
                deviceId: existing.deviceId,
                timestamp: new Date(telemetryRecuperated.timestamp),
                motion: telemetryRecuperated.motion,
                battery: telemetryRecuperated.battery
            };

            const telemetryBdd = await createTelemetry(newTelemetry);
            console.log(telemetryBdd);


            return res.status(201).json({ "ok": true });
        }

    } catch(error) {

        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}