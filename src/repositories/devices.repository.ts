import { getDB } from "../db.ts";
import type { Device } from "../type.ts";


// POST devices/register
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


export const createDevice = async(deviceData: Device): Promise<Device> => {
    const db = getDB();

    const result = await db.collection("devices").insertOne(deviceData);

    deviceData._id = result.insertedId;

    return deviceData;
};


export const deleteDevice = async (deviceId: string): Promise<void> => {
    const db = getDB();
    await db.collection("devices").deleteOne({ deviceId });
};

/*export const updateDevice = async (deviceId: string, updates: any): Promise<Device | null> => {
    const db = getDB();
    
    const result = await db.collection("devices").findOneAndUpdate(
        { deviceId: deviceId },
        { $set: updates },
        { returnDocument: "after" }
    );
    
    return result.value;
};*/



// GET devices/me
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