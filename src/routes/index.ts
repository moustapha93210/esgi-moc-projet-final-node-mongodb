import { type Request, type Response, type NextFunction, Router } from "express";
import pingRoutes from "../ping/ping.routes.ts";

const router = Router();

router.use(pingRoutes);

const checkAdminApiKey = (req: Request, res: Response, next: NextFunction) => {
    const adminApiKey = req.headers["x-admin-api-key"];
    if(adminApiKey !== process.env.ADMIN_API_KEY)
    {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
}

const adminRoutes = Router();

adminRoutes.use("/admin/devices/:deviceId/approve", checkAdminApiKey, async (req, res) => {
    /* code ... */
    res.json({ ok: true });
});

adminRoutes.use("/admin/devices/:deviceId/revoke", checkAdminApiKey, async (req, res) => {
    /* code ... */
    res.json({ ok: true });
});

router.use(adminRoutes);

export default router;
