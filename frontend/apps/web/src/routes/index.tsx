// pages - auth
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { VerifyEmailPage } from "@/features/auth/pages/VerifyEmailPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";

// pages - main
import { AboutPage } from "@/features/about";
import { LandingPage } from "@/features/landing/pages/LandingPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { ProfilePage } from "@/features/profile/pages/ProfilePage";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";

// layouts
import { AuthLayout } from "@/routes/layouts/AuthLayout";
import { DashboardLayout } from "@/routes/layouts/DashboardLayout";
import { MainLayout } from "@/routes/layouts/MainLayout";

// guards
import { AuthGuard } from "@/routes/guards/AuthGuard";
import { GuestGuard } from "@/routes/guards/GuestGuard";

export const routes = [
  // ── صفحات عامة (لا تحتاج تسجيل) ─────────────────────────────────────────
  { path: "/", element: <LandingPage /> },
  {
    element: <MainLayout />,
    children: [
      { path: "/about", element: <AboutPage /> },
    ],
  },

  // ── صفحات تتطلب تسجيل دخول ──────────────────────────────────────────────
  {
    element: <AuthGuard />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/settings", element: <SettingsPage /> },
        ],
      },
    ],
  },

  // ── صفحات المصادقة (للزوار فقط) ──────────────────────────────────────────
  {
    element: <GuestGuard />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/auth/login", element: <LoginPage /> },
          { path: "/auth/register", element: <RegisterPage /> },
          { path: "/auth/forgot-password", element: <ForgotPasswordPage /> },
        ],
      },
    ],
  },

  // ── التحقق من البريد وإعادة تعيين كلمة المرور (للمستخدمين الجدد) ──────────
  {
    element: <AuthLayout />,
    children: [
      { path: "/auth/verify-email", element: <VerifyEmailPage /> },
      { path: "/auth/reset-password", element: <ResetPasswordPage /> },
    ],
  },
];