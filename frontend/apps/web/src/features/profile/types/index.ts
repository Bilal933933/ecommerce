export type {
  ProfileUser,
  ProfileActiveSession,
  ProfileResponse,
  Gender,
} from "@workspace/types";

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface EditProfileData {
  name: string;
  email: string;
  deviceName: string | null;
  phone: string | null;
  bio: string | null;
  gender: "MALE" | "FEMALE" | null;
  birthDate: string | null;
}

export interface ProfileActionResult {
  success: boolean;
  message: string;
  field?: string;
  emailChanged?: boolean;
}
