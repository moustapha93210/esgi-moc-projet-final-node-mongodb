import { Router } from "express";
import { postDevicesRegister } from "../controllers/devices.controller.ts";

const devicesRoutes = Router();

// Route pour l'enregistrement d'un device
devicesRoutes.post("/register", postDevicesRegister);

export default devicesRoutes;
