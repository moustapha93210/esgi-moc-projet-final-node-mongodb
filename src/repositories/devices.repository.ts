import { getDB } from "../db.ts";
import type { Device } from "../types.ts";
import type { RegisterDeviceInput } from "../devices/devices.schema.ts";
import { randomBytes } from "node:crypto";

export const devicesRepository = {
  async findAll() {
    return getDB().collection<Device>("devices").find().toArray();
  },
  async create(data: RegisterDeviceInput): Promise<Device> {
    const db = await getDB();

    const newDevice: Device = {
      ...data,
      status: "pending",
      deviceAccessKey: randomBytes(16).toString("hex"),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await db.collection<Device>("devices").insertOne(newDevice);

    return newDevice;
  },
};
