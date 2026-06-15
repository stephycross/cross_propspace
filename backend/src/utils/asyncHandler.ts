import { Request, Response, NextFunction, RequestHandler } from "express";

// Wraps async controllers so rejected promises reach the error middleware
// instead of crashing the process with an unhandled rejection.
export function asyncHandler(handler: RequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
