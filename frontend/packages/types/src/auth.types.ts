// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = "ADMIN" | "STUDENT";

export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated";

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  avatarUrl?: string | null;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: AuthStatus;
}

export interface AuthActions {
  setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setStatus: (status: AuthStatus) => void;
}

export type AuthStore = AuthState & AuthActions;

// ─── API Responses ────────────────────────────────────────────────────────────

export interface LoginResponse {
  user: AuthUser;
  refreshToken: string;
  accessToken: string;
}

export interface RegisterResponse {
  user: AuthUser;
  refreshToken: string;
  accessToken: string;
}

// ─── API Requests ─────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResendVerificationResponse {
  message: string;
}
