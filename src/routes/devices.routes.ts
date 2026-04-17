import { Router } from "express";
import { getDeviceMe, postDevicesRegister } from "../controllers/devices.controllers.ts";

const devicesRoutes = Router();


// Créer un handler pour les requêtes entrantes POST sur /devices
devicesRoutes.post("/register", postDevicesRegister);

// Créer un handler pour les requêtes entrantes GET sur /devices
devicesRoutes.get("/me", getDeviceMe);



export default devicesRoutes;

