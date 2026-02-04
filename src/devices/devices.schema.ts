import { z } from "zod";

export const registerDevice = z.object({
    deviceId: z.string().min(1),
    name: z.string().min(2),
    type: z.enum(["climate", "presence"]),

});

export type RegisterDeviceInput = z.infer<typeof registerDevice>;