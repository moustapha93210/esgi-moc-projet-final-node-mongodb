import { getDB } from "../db.ts";
import type { Device, DeviceStatus } from "../type.ts";


// POST /devices/register
export const findDeviceByDeviceId = async (deviceId: string): Promise<Device | null> => {
    
    const db = getDB();

    const device = await db.collection("devices").findOne({ deviceId });
    
    if(device)
    {
        return device as Device;
    }
    else
    {
        return null;
    }
};


export const createDevice = async (deviceData: Device): Promise<Device> => {
    
    const db = getDB();

    const result = await db.collection("devices").insertOne(deviceData);

    deviceData._id = result.insertedId;

    return deviceData;
};


export const deleteDevice = async (deviceId: string): Promise<void> => {
    
    const db = getDB();
    await db.collection("devices").deleteOne({ deviceId });
};




// GET /devices/me
export const findDeviceByDeviceAccessKey = async (deviceAccessKey: string): Promise<Device | null> => {

    const db = getDB();

    const device = await db.collection("devices").findOne({ deviceAccessKey });

    if(device)
    {
        return device as Device;
    }
    else
    {
        return null;
    }
};



// POST /admin/devices/:id/approve et /admin/devices/:id/revoke
export const updateDeviceStatus = async (deviceId: string, newStatus: DeviceStatus): Promise<void> => {
    
    const db = getDB();
    
    await db.collection("devices").updateOne(
        { deviceId: deviceId },
        { $set: { status: newStatus } },
    );
};



// GET /admin/devices?status=:status
export const findDevicesByStatus = async (status?: string): Promise<Device[]> => {

    const db = getDB();

    const filter = status ? { status } : {} ;

    const device = await db.collection("devices").find(filter).toArray();

    return device as Device[];
};