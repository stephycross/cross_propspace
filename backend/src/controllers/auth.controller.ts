import { Request, Response } from "express";
import { authService } from "../services/auth.service";

// Controllers stay thin: parse input, delegate to the service, map the result
// to an HTTP status. No business rules live here.
export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const { email, username, password } = req.body;
    const result = await authService.register({ email, username, password });
    res.status(201).json(result);
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.status(200).json(result);
  }
}

export const authController = new AuthController();
