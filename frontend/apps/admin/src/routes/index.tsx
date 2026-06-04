import { LoginPage } from "@/features/auth"

// pages - main
import { DashboardPage } from "@/features/dashboard"
import { AboutPage } from "@/features/about"
import { ProfilePage } from "@/features/profile"
import { SettingsPage } from "@/features/settings"
import { Products } from "@/pages/Products"

// layouts
import { MainLayout } from "@/routes/layouts/MainLayout"
import { AuthLayout } from "@/routes/layouts/AuthLayout"

// guards
import { AuthGuard } from "@/routes/guards/AuthGuard"
import { GuestGuard } from "@/routes/guards/GuestGuard"

export const routes = [
  // ── Authenticated pages
  {
    element: <AuthGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/settings", element: <SettingsPage /> },
          { path: "/about", element: <AboutPage /> },
          { path: "/products", element: <Products /> },
        ],
      },
    ],
  },

  // ── Auth pages (for guests only)
  {
    element: <GuestGuard />,
    children: [
      {
        element: <AuthLayout />,
        children: [{ path: "/auth/login", element: <LoginPage /> }],
      },
    ],
  },
]
