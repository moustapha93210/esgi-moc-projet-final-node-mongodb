import { Router } from "express";
import { postAdminApprove, postAdminRevoke, getAdminStatus, getAdminId } from "../controllers/admin.controllers.ts";

const adminRoutes = Router();


// Créer un handler pour les requêtes POST sur /admin/devices/:id/approve
adminRoutes.post("/:id/approve", postAdminApprove);

// Créer un handler pour les requêtes POST sur /admin/devices/:id/revoke
adminRoutes.post("/:id/revoke", postAdminRevoke);

// Créer un handler pour les requêtes GET sur /admin/devices?status=:status
adminRoutes.get("/", getAdminStatus);

// Créer un handler pour les requêtes GET sur /admin/devices/:id
adminRoutes.get("/:id", getAdminId);



export default adminRoutes;