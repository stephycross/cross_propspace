import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";

// Validates the Bearer token on the server before any protected handler runs.
// The decoded user id is attached to the request for downstream ownership checks.
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Missing authorization token"));
  }

  const token = header.slice("Bearer ".length).trim();
  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
}
