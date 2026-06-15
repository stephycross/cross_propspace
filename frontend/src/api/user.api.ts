import { apiClient } from "./client";
import { User } from "../types/user";

export const userApi = {
  getProfile(signal?: AbortSignal) {
    return apiClient.get<User>("/users/me", signal);
  },
  updateProfile(input: { username?: string; phone?: string; avatarUrl?: string }) {
    return apiClient.put<User>("/users/me", input);
  },
  changePassword(input: { currentPassword: string; newPassword: string }) {
    return apiClient.put<{ message: string }>("/users/me/password", input);
  },
};
