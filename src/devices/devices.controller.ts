import type { Request, Response } from "express";
import { registerDevice } from "./devices.schema.ts";
import { devicesRepository } from "../repositories/devices.repository.ts";

export const devicesController = {
  async register(req: Request, res: Response) {
    try {
      const validatedData = registerDevice.parse(req.body);
      const device = await devicesRepository.create(validatedData);
      res.status(201).json(device);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Invalid device data" });
    }
  },
};
