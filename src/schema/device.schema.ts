import { z } from "zod";

export const DeviceSchema = z.object({
    deviceId: z.string().min(1).length(36),
    name: z.string().min(1).max(100),
    type: z.enum(["climate", "presence"])
});

// Pour que le type suit automatiquement le schéma zod au dessus
export type DeviceSchemaInput = z.infer<typeof DeviceSchema>;



/*export const DeviceSchemaGetDevicesMe = z.object({
    deviceId: z.string().min(1).length(36),
    name: z.string().min(1).max(100),
    type: z.enum(["climate", "presence"]),
    status: z.enum(["pending", "active", "revoked"])
});

export type DeviceSchemaGetDeviceMe = z.infer<typeof DeviceSchemaGetDevicesMe>;*/