export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  displayName?: string;
  role: string;
  permissions: string[];
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface LoginResponseData {
  auth: AuthUser;
  token: string;
  refreshToken: string;
}
