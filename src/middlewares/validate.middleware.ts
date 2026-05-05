import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

// Utilisé pour valider le body d'une requête avant d'arriver au controller
export const validate = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
      // Valider le body avec le schéma Zod fourni
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: result.error.issues,
        });
      }
      req.body = result.data;
      next();
    };
};
