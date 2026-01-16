export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}