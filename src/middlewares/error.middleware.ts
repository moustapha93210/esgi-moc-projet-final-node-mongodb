import type { NextFunction, Request, Response } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
};