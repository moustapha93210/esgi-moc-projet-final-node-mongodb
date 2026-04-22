import { getDB } from "../db.ts";
import type { Telemetry } from "../type.ts";


// POST /telemetry
export const createTelemetry = async (telemetryData: Telemetry): Promise<Telemetry> => {
    
    const db = getDB();

    const result = await db.collection("telemetry").insertOne(telemetryData);

    telemetryData._id = result.insertedId;

    return telemetryData;
};



// GET /admin/devices/:id/telemtry
export const findTelemetryByDeviceId = async (deviceId: string, paramLimit: number, paramOffset: number): Promise<Telemetry[]> => {

    const db = getDB();

    const telemetryFilteredByDeviceId = await db.collection("telemetry").find({ deviceId })
                                                                       .sort({ timestamp: -1 })
                                                                       .skip(paramOffset)
                                                                       .limit(paramLimit)
                                                                       .toArray();

    return telemetryFilteredByDeviceId as Telemetry[];
};



export const countTelemetryByDeviceId = async (deviceId: string): Promise<number> => {

    const db = getDB();

    const numberOfTelemetryByDeviceId = await db.collection("telemetry").countDocuments({ deviceId });

    return numberOfTelemetryByDeviceId;
};