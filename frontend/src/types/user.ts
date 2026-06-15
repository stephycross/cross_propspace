export interface User {
  id: string;
  email: string;
  username: string;
  phone?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
