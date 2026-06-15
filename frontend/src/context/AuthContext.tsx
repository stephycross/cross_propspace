import { createContext, useEffect, useMemo, useState, ReactNode } from "react";
import { User } from "../types/user";
import { authApi } from "../api/auth.api";
import { userApi } from "../api/user.api";
import { getToken, setToken, clearToken } from "../api/client";

interface AuthContextValue {
  user: User | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // On first mount, if a token survived a refresh, rehydrate the session.
  useEffect(() => {
    const controller = new AbortController();

    async function restoreSession(): Promise<void> {
      if (!getToken()) {
        setInitializing(false);
        return;
      }
      try {
        const profile = await userApi.getProfile(controller.signal);
        setUser(profile);
      } catch {
        clearToken();
      } finally {
        setInitializing(false);
      }
    }

    restoreSession();
    return () => controller.abort();
  }, []);

  async function login(email: string, password: string): Promise<void> {
    const result = await authApi.login({ email, password });
    setToken(result.token);
    setUser(result.user);
  }

  async function register(email: string, username: string, password: string): Promise<void> {
    const result = await authApi.register({ email, username, password });
    setToken(result.token);
    setUser(result.user);
  }

  function logout(): void {
    clearToken();
    setUser(null);
  }

  const value = useMemo<AuthContextValue>(
    () => ({ user, initializing, login, register, logout, setUser }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
