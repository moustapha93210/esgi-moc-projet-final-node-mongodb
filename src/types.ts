import { ObjectId } from "mongodb";

export type DeviceStatus = "pending" | "active" | "revoked";
export type DeviceType = "climate" | "presence";

export type Device = {
  _id?: ObjectId;
  deviceId: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  deviceAccessKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Telemetry = {
  _id? : ObjectId;
  deviceId: string;
  timestamp: Date;
  temperature?: number;
  humidity?: number;
  motion?: boolean;
  battery?: number;

}
