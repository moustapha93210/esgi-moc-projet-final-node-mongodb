import { Router } from "express";
import { postDevicesRegister } from "../controllers/devices.controller.ts";

const devicesRoutes = Router();

// Créer un handler pour les requêtes entrantes POST sur /devices
devicesRoutes.post("/register", postDevicesRegister);

export default devicesRoutes;
