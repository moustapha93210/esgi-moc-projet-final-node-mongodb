import { Router } from "express";
import { postAdminApprove, postAdminRevoke } from "../controllers/admin.controllers.ts";

const adminRoutes = Router();


// Créer un handler pour les requêtes POST sur /admin/devices/:id/approve
adminRoutes.post("/:id/approve", postAdminApprove);

// Créer un handler pour les requêtes POST sur /admin/devices/:id/revoke
adminRoutes.post("/:id/revoke", postAdminRevoke);



export default adminRoutes;