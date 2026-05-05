import { getDB } from "../db.ts";
import type { Telemetry } from "../types.ts";

// Type des statistiques retournées par le pipeline d'agrégation MongoDB
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
// Insère une nouvelle mesure dans MongoDB et attache l'_id généré à l'objet
export const createTelemetry = async (
    telemetryData: Telemetry): Promise<Telemetry> => {
        const db = getDB();
        const result = await db.collection("telemetry").insertOne(telemetryData);
    telemetryData._id = result.insertedId;
    return telemetryData;
    };
// Retourne les mesures paginées d'un device
export const findTelemetryByDeviceId = async (deviceId: string, limit: number, offset: number): Promise<{data:Telemetry[], total: number }> => {
  const db = getDB();

  const data = await db
    .collection("telemetry")
    .find({ deviceId })
    .sort({ timestamp: -1 })
    .skip(offset)
    .limit(limit)
    .toArray();

  // countDocuments pour avoir le total
  const total = await db.collection("telemetry").countDocuments({ deviceId });

  return { data: data as Telemetry[], total };
}
// Retourne uniquement la dernière mesure d'un device
export const findLatestTelemetry = async (deviceId: string): Promise<Telemetry | null> => {
    const db = getDB();
    const result = await db.collection("telemetry").findOne({ deviceId }, { sort: { timestamp: -1}});

    if (result) {
        return result as Telemetry;
    }else {
        return null;
    }
}

// Calcule les statistiques agrégées d'un device sur une période donnée
export const findTelemetryStats = async ( deviceId: string, from: Date, to: Date): Promise<TelemetryStats> => {
    const db = getDB();
    const pipeline = [
      // Filtrer les mesures par deviceId et par période
      { $match: { deviceId, timestamp: { $gte: from, $lte: to } } },
      {
        //Calculer les stats sur toutes les mesures filtrées
        $group: {
          _id: null,
          count: { $sum: 1 },
          tempMin: { $min: "$temperature" },
          tempMax: { $max: "$temperature" },
          tempAvg: { $avg: "$temperature" },
          humMin: { $min: "$humidity" },
          humMax: { $max: "$humidity" },
          humAvg: { $avg: "$humidity" },
          motionDetected: {
            $sum: { $cond: [{ $eq: ["$motion", true] }, 1, 0] },
          },
        },
      },
    ];
    const result = await db.collection("telemetry").aggregate(pipeline).toArray();
    if (result.length === 0) {
        return { count: 0};
    }
    return result[0] as TelemetryStats;

};