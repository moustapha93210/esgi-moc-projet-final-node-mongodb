import { getDB } from "../db.ts";
import type { Telemetry } from "../types.ts";

export const createTelemetry = async (
    data: Telemetry): Promise<void> => {
        const db = getDB();
        await db.collection("telemetry").insertOne(data);

    };