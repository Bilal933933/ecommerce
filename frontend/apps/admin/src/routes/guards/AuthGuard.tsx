import { useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore, selectIsAuthenticated, selectUser, selectStatus } from "@workspace/store";
import { useAppStore } from "@workspace/store/useAppStore";
import { locales } from "@workspace/locales";

export function AuthGuard() {
  useLocation();
  const { language } = useAppStore();
  const t = locales[language].app;

  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore(selectUser);
  const status = useAuthStore(selectStatus);

  const isAdmin = useMemo(() => user?.role === "ADMIN", [user?.role]);

  if (status === "idle" || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">{t.checkingSession ?? "جارٍ التحقق من الجلسة..."}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-destructive">403</h1>
          <p className="text-lg text-muted-foreground">{t.forbidden.description}</p>
          <a
            href="http://localhost:3000"
            className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t.forbidden.backToHome}
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
