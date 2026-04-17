import type { Request, Response, NextFunction } from "express";


// Middleware d'authentification pour l'admin
export const checkAdminApiKey = (req: Request, res: Response, next: NextFunction) => {
    
    const adminApiKey = req.headers["x-api-key"];
    
    if(adminApiKey !== process.env.ADMIN_API_KEY)
    {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
};