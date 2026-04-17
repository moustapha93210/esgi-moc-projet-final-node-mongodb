import { ObjectId } from "mongodb";

export type DeviceType = "climate" | "presence";

export type DeviceStatus = "pending" | "active" | "revoked";

export type Device = {
    _id?: ObjectId;
    deviceId: string;
    name: string;
    type: DeviceType;
    deviceAccessKey: string;
    status: DeviceStatus;
    createdAt: Date;
};

export type Telemetry = {
    _id?: ObjectId;
    deviceId: string;
    timestamp: Date;
    // Pour climate
    temperature?: number;
    humidity?: number;
    // Pour presence
    motion?: boolean;

    battery?: number;
};