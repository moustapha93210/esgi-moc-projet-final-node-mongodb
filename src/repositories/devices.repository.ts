import { getDB } from "../db.ts";
import type { Device, DeviceStatus } from "../types.ts";


// Cherche un device par son deviceId
export const findDeviceByDeviceId = async (
  deviceId: string,
): Promise<Device | null> => {
  const db = getDB();

  const device = await db.collection("devices").findOne({ deviceId });

  if (device) {
    return device as Device;
  } else {
    return null;
  }
};
// Insère un nouveau device dans MongoDB et attache l'_id généré à l'objet
export const createDevice = async (deviceData: Device): Promise<Device> => {
  const db = getDB();

  const result = await db.collection("devices").insertOne(deviceData);

  deviceData._id = result.insertedId;

  return deviceData;
};
// Supprime un device
export const deleteDevice = async (deviceId: string): Promise<void> => {
  const db = getDB();
  await db.collection("devices").deleteOne({ deviceId });
};
// Met à jour un device et retourne le document après modification
export const updateDevice = async (
  deviceId: string,
  updates: Partial<Device>,
): Promise<Device | null> => {
  const db = getDB();

  const result = await db
    .collection("devices")
    .findOneAndUpdate(
      { deviceId: deviceId },
      { $set: updates },
      { returnDocument: "after" },
    );

  return result as Device | null;
};

// Cherche un device par sa deviceAccessKey
export const findDeviceByDeviceAccessKey = async (
  deviceAccessKey: string,
): Promise<Device | null> => {
  const db = getDB();

  const device = await db.collection("devices").findOne({ deviceAccessKey });

  if (device) {
    return device as Device;
  } else {
    return null;
  }
};
// Retourne tous les devices avec un filtre optionnel sur le status
export const findAllDevices = async (status?: string): Promise<Device[]> => {
  const db = getDB();

  const query: Partial<Device> = {};
  if (status) {
    query.status =  status as DeviceStatus;
  }

  const devices = await db.collection("devices").find(query).toArray();
  return devices as Device[];
};
