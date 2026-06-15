import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";
import { signToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import {
  isValidEmail,
  isNonEmptyString,
  isStrongEnoughPassword,
} from "../utils/validators";
import { UserDocument } from "../models/user.model";

const SALT_ROUNDS = 10;

export interface AuthResult {
  token: string;
  user: PublicUser;
}

export interface PublicUser {
  id: string;
  email: string;
  username: string;
  phone?: string;
  avatarUrl?: string;
}

function toPublicUser(user: UserDocument): PublicUser {
  return {
    id: user._id.toString(),
    email: user.email,
    username: user.username,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
  };
}

export class AuthService {
  async register(input: {
    email: string;
    username: string;
    password: string;
  }): Promise<AuthResult> {
    if (!isValidEmail(input.email)) {
      throw ApiError.badRequest("A valid email is required");
    }
    if (!isNonEmptyString(input.username)) {
      throw ApiError.badRequest("Username is required");
    }
    if (!isStrongEnoughPassword(input.password)) {
      throw ApiError.badRequest("Password must be at least 6 characters");
    }

    const existingEmail = await userRepository.findByEmail(input.email);
    if (existingEmail) {
      throw ApiError.conflict("An account with this email already exists");
    }
    const existingUsername = await userRepository.findByUsername(input.username);
    if (existingUsername) {
      throw ApiError.conflict("This username is already taken");
    }

    const hashed = await bcrypt.hash(input.password, SALT_ROUNDS);
    const user = await userRepository.create({
      email: input.email.toLowerCase().trim(),
      username: input.username.trim(),
      password: hashed,
    });

    return { token: signToken({ userId: user._id.toString() }), user: toPublicUser(user) };
  }

  async login(input: { email: string; password: string }): Promise<AuthResult> {
    if (!isValidEmail(input.email) || !isNonEmptyString(input.password)) {
      throw ApiError.badRequest("Email and password are required");
    }

    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    // Load the hash explicitly since the model hides it by default.
    const withPassword = await userRepository.findByIdWithPassword(user._id.toString());
    const matches = withPassword
      ? await bcrypt.compare(input.password, withPassword.password)
      : false;
    if (!matches) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    return { token: signToken({ userId: user._id.toString() }), user: toPublicUser(user) };
  }
}

export const authService = new AuthService();
export { toPublicUser };
