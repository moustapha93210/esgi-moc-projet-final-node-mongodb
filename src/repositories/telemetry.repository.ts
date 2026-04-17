import { getDB } from "../db.ts";
import type { Telemetry } from "../type.ts";


// POST /telemetry
export const createTelemetry = async(telemetryData: Telemetry): Promise<Telemetry> => {
    
    const db = getDB();

    const result = await db.collection("telemetry").insertOne(telemetryData);

    telemetryData._id = result.insertedId;

    return telemetryData;
};