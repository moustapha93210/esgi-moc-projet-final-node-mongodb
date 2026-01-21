import { ObjectId } from "mongodb";

export type DeviceStatus = "pending" | "active" | "revoked";
export type DeviceType = "climate" | "presence";

export interface Device {
  _id?: ObjectId;
  deviceId: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  deviceAccessKey: string;
  createdAt: Date;
  updatedAt: Date;
}
