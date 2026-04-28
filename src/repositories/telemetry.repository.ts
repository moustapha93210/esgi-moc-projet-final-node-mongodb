import { getDB } from "../db.ts";
import type { Telemetry } from "../types.ts";

export const createTelemetry = async (
    telemetryData: Telemetry): Promise<Telemetry> => {
        const db = getDB();
        const result = await db.collection("telemetry").insertOne(telemetryData);
    telemetryData._id = result.insertedId;
    return telemetryData;
    };

export const findTelemetryByDeviceId = async (deviceId: string, limit: number, offset: number): Promise<{data:Telemetry[], total: number }> => {
    const db= getDB();

    const data = await db.collection("telemetry").find({ deviceId}).sort({ timestamp: -1}).skip(offset).limit(limit).toArray();
    const total = await db.collection("telemetry").countDocuments({ deviceId });

    return { data: data as Telemetry[], total};

}

export const findLatestTelemetry = async (deviceId: string): Promise<Telemetry | null> => {
    const db = getDB();
    const result = await db.collection("telemetry").findOne({ deviceId }, { sort: { timestamp: -1}});

    if (result) {
        return result as Telemetry;
    }else {
        return null;
    }
}