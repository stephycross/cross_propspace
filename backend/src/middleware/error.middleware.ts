import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

// Central handler that maps thrown errors to consistent JSON responses.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // Mongoose duplicate key and cast errors map to predictable client codes.
  const anyErr = err as { name?: string; code?: number; message?: string };
  if (anyErr?.code === 11000) {
    res.status(409).json({ message: "A record with these details already exists" });
    return;
  }
  if (anyErr?.name === "CastError") {
    res.status(400).json({ message: "Malformed identifier" });
    return;
  }

  console.error(err);
  res.status(500).json({
    message: env.nodeEnv === "production" ? "Internal server error" : anyErr?.message,
  });
}
