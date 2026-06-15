import { apiClient } from "./client";
import { AuthResponse } from "../types/user";

export const authApi = {
  register(input: { email: string; username: string; password: string }) {
    return apiClient.post<AuthResponse>("/auth/register", input);
  },
  login(input: { email: string; password: string }) {
    return apiClient.post<AuthResponse>("/auth/login", input);
  },
};
