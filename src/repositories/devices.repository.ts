import { getDB } from "../db.ts";
import type { Device } from "../types.ts";

export const devicesRepository = {
  async findAll() {
    return getDB().collection<Device>("devices").find().toArray();
  },
};
