// Augments the Express Request so authenticated routes can read req.userId
// after the auth middleware has verified the token.
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {};
