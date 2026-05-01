import { Router } from "express";
import { requireDeviceKey } from "../middlewares/auth.middleware.ts";
import { postTelemetry } from "../controllers/telemetry.controller.ts";

const telemetryRoutes = Router();

telemetryRoutes.post("/telemetry", requireDeviceKey, postTelemetry);

export default telemetryRoutes;
