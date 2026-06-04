import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource-variable/geist";
import "@fontsource-variable/noto-kufi-arabic";
import "@fontsource/cascadia-code";
import "@workspace/ui/styles/globals.css";
import { App } from "./App.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { AuthProvider } from "@/AuthProvider.tsx";
import { HelmetProvider } from "react-helmet-async";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient, initApiClient } from "@workspace/api-client";
import { useAuthStore } from "@workspace/store";

import { Toaster } from "sonner";

// ── تهيئة الـ API Client مع ربط الـ Store ─────────────────────────────────────
initApiClient({
  getAccessToken: () => useAuthStore.getState().accessToken,
  getRefreshToken: () => useAuthStore.getState().refreshToken,
  onSessionExpired: () => useAuthStore.getState().logout(),
  onSessionRefreshed: (data) =>
    useAuthStore.getState().setTokens(data.accessToken, data.refreshToken),
});

// ─── Render ───────────────────────────────────────────────────────────────────

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <HelmetProvider>
            <App />
          </HelmetProvider>
          <Toaster position="top-center" richColors dir="rtl" />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);