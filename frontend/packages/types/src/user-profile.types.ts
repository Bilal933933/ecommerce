import type { UserRole } from './auth.types';

export type Gender = 'MALE' | 'FEMALE';

export interface ProfileUser {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  isActive: boolean;
  deviceName: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  phone: string | null;
  bio: string | null;
  gender: Gender | null;
  birthDate: string | null;
}

export interface ProfileActiveSession {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  expiresAt: string;
  createdAt: string;
}

export interface ProfileResponse {
  user: ProfileUser;
  activeSessions: ProfileActiveSession[];
}

export interface UpdateMeRequest {
  name?: string;
  email?: string;
  deviceName?: string | null;
  phone?: string | null;
  bio?: string | null;
  gender?: Gender | null;
  birthDate?: string | null;
}

export interface UpdateMeResponse {
  user: ProfileUser;
  emailChanged: boolean;
}
