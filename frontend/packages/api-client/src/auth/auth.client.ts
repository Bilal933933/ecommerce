import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  VerifyEmailRequest,
  ResetPasswordRequest,
} from "@workspace/types";
import { http } from "../http";

import type { ApiResponse } from "@workspace/types";

// ─── Auth Client ──────────────────────────────────────────────────────────────

export const authClient = {
  /**
   * تسجيل الدخول
   * الـ refreshToken يُحفظ تلقائياً في httpOnly cookie من الـ Backend
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await http.post<ApiResponse<LoginResponse>>("/auth/login", data);
    return response.data.data!;
  },

  /**
   * إنشاء حساب جديد
   * يُرسل بريد التحقق تلقائياً من الـ Backend
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await http.post<ApiResponse<RegisterResponse>>("/auth/register", data);
    return response.data.data!;
  },

  /**
   * تسجيل الخروج
   * يحذف الـ refreshToken من الـ Backend
   */
  logout: async (refreshToken: string): Promise<void> => {
    await http.post("/auth/logout", { refreshToken });
  },

  /**
   * تسجيل الخروج من جميع الأجهزة
   */
  logoutAll: async (): Promise<{ revokedCount: number }> => {
    const response = await http.post<ApiResponse<{ revokedCount: number }>>(
      "/auth/logout-all",
    );
    return response.data.data!;
  },

  /**
   * تغيير كلمة المرور (للمستخدم المسجّل)
   */
  changePassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    const response = await http.post<ApiResponse<{ message: string }>>(
      "/auth/change-password",
      data,
    );
    return response.data.data!;
  },

  /**
   * طلب إعادة تعيين كلمة المرور
   * يُرسل بريد إلكتروني بالرابط
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    const response = await http.post<ApiResponse<{ message: string }>>(
      "/auth/forgot-password",
      data
    );
    return response.data.data!;
  },

  /**
   * الحصول على معلومات المستخدم الحالي عن طريق التجديد (كحل بديل إن لم يوجد مسار /me)
   */
  getMe: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await http.post<ApiResponse<LoginResponse>>("/auth/refresh", { refreshToken });
    return response.data.data!;
  },

  /**
   * تأكيد البريد الإلكتروني باستخدام التوكن
   */
  verifyEmail: async (data: VerifyEmailRequest): Promise<{ message: string }> => {
    const response = await http.post<ApiResponse<{ message: string }>>("/auth/verify-email", data);
    return response.data.data!;
  },

  /**
   * إعادة إرسال بريد التحقق
   */
  resendVerification: async (): Promise<{ message: string }> => {
    const response = await http.post<ApiResponse<{ message: string }>>("/auth/resend-verification");
    return response.data.data!;
  },

  /**
   * تعيين كلمة مرور جديدة باستخدام التوكن
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await http.post<ApiResponse<{ message: string }>>("/auth/reset-password", data);
    return response.data.data!;
  },
};
