import { Request, Response } from "express";
import { userService } from "../services/user.service";

export class UserController {
  async getProfile(req: Request, res: Response): Promise<void> {
    const profile = await userService.getProfile(req.userId as string);
    res.status(200).json(profile);
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    const { username, phone, avatarUrl } = req.body;
    const updated = await userService.updateProfile(req.userId as string, {
      username,
      phone,
      avatarUrl,
    });
    res.status(200).json(updated);
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    const { currentPassword, newPassword } = req.body;
    await userService.changePassword(req.userId as string, { currentPassword, newPassword });
    res.status(200).json({ message: "Password updated successfully" });
  }
}

export const userController = new UserController();
