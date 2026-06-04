import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore, selectIsAuthenticated, selectStatus } from "@workspace/store";

export function GuestGuard() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const status = useAuthStore(selectStatus);

  if (status === "idle" || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">جارٍ التحقق من الجلسة...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
