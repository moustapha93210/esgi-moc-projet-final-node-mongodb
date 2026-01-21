import type { Request, Response } from "express";
import { devicesRepository } from "../repositories/devices.repository.ts";

export const adminController = {
  async listDevices(_req: Request, res: Response) {
    try {
      const devices = await devicesRepository.findAll();
      res.json(devices);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  },
};
