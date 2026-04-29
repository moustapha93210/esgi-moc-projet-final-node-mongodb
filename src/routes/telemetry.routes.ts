import { Router } from "express";
import { postTelemetry } from "../controllers/telemetry.controllers.ts";

const telemetryRoutes = Router();


// Créer un handler pour les requêtes entrantes POST sur /telemetry/
telemetryRoutes.post("/", postTelemetry);




export default telemetryRoutes;