import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/ApiError";
import { isNonEmptyString, isStrongEnoughPassword } from "../utils/validators";
import { PublicUser, toPublicUser } from "./auth.service";

const SALT_ROUNDS = 10;

export class UserService {
  async getProfile(userId: string): Promise<PublicUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound("Account not found");
    }
    return toPublicUser(user);
  }

  async updateProfile(
    userId: string,
    input: { username?: string; phone?: string; avatarUrl?: string }
  ): Promise<PublicUser> {
    const updates: Record<string, string> = {};

    if (input.username !== undefined) {
      if (!isNonEmptyString(input.username)) {
        throw ApiError.badRequest("Username cannot be empty");
      }
      const taken = await userRepository.findByUsername(input.username.trim());
      if (taken && taken._id.toString() !== userId) {
        throw ApiError.conflict("This username is already taken");
      }
      updates.username = input.username.trim();
    }
    if (input.phone !== undefined) updates.phone = input.phone.trim();
    if (input.avatarUrl !== undefined) updates.avatarUrl = input.avatarUrl.trim();

    const updated = await userRepository.update(userId, updates);
    if (!updated) {
      throw ApiError.notFound("Account not found");
    }
    return toPublicUser(updated);
  }

  async changePassword(
    userId: string,
    input: { currentPassword: string; newPassword: string }
  ): Promise<void> {
    if (!isStrongEnoughPassword(input.newPassword)) {
      throw ApiError.badRequest("New password must be at least 6 characters");
    }

    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) {
      throw ApiError.notFound("Account not found");
    }

    // Verify the old password before allowing a change.
    const matches = await bcrypt.compare(input.currentPassword, user.password);
    if (!matches) {
      throw ApiError.unauthorized("Current password is incorrect");
    }

    const hashed = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
    await userRepository.update(userId, { password: hashed });
  }
}

export const userService = new UserService();
