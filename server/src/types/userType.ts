export interface User {
  email: string;
  password: string;
  role: string;
  refreshToken?: string | null;
}
