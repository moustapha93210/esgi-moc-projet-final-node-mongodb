import { z } from "zod";


export const TelemetrySchemaClimate = z.object({
    timestamp: z.iso.datetime(),
    temperature: z.number(),
    humidity: z.number(),
    battery: z.number().int().min(0).max(100).optional()
});

export type TelemetrySchemaClimate = z.infer<typeof TelemetrySchemaClimate>;




export const TelemetrySchemaPresence = z.object({
    timestamp: z.iso.datetime(),
    motion: z.boolean(),
    battery: z.number().int().min(0).max(100).optional()
});

export type TelemetrySchemaPresence = z.infer<typeof TelemetrySchemaPresence>;