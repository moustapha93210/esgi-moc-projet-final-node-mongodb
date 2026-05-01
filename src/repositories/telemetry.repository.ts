import { getDB } from "../db.ts";
import type { Telemetry } from "../types.ts";

type TelemetryStats = {
  count: number;
  tempMin?: number;
  tempMax?: number;
  tempAvg?: number;
  humMin?: number;
  humMax?: number;
  humAvg?: number;
  motionDetected?: number;
};

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

export const findTelemetryStats = async ( deviceId: string, from: Date, to: Date): Promise<TelemetryStats> => {
    const db = getDB();
    const pipeline = [
        { $match: { deviceId, timestamp: { $gte: from, $lte: to }}},
        { $group: {
            _id: null,
            count: { $sum: 1 },
            tempMin: { $min: "$temperature" },
            tempMax: { $max: "$temperature" },
            tempAvg: { $avg: "$temperature" },
            humMin: { $min: "$humidity" },
            humMax: { $max: "$humidity" },
            humAvg: { $avg: "$humidity" },
            motionDetected: { $sum: { $cond:[{ $eq: ["$motion", true] }, 1, 0 ]}}
        }},
    ];
    const result = await db.collection("telemetry").aggregate(pipeline).toArray();
    if (result.length === 0) {
        return { count: 0};
    }
    return result[0] as TelemetryStats;

};