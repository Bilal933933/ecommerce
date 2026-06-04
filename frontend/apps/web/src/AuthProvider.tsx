import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { usersClient } from "@workspace/api-client";
import { useAuthStore } from "@workspace/store";

// ─── Props ────────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: AuthProviderProps) {
  const isInitializing = useRef(false);

  useEffect(() => {
    const validateSession = async () => {
      if (isInitializing.current) return;
      isInitializing.current = true;

      const { accessToken, refreshToken, setStatus, setAuth, logout } =
        useAuthStore.getState();

      if (!accessToken || !refreshToken) {
        setStatus("unauthenticated");
        isInitializing.current = false;
        return;
      }

      try {
        // Fetch current user profile. If the access token is expired, 
        // the Axios interceptor will automatically refresh the tokens.
        const response = await usersClient.getMyProfile();
        
        // Get the latest tokens from the store (which might have been rotated by the interceptor)
        const updatedTokens = useAuthStore.getState();
        if (updatedTokens.accessToken && updatedTokens.refreshToken) {
          setAuth(response.user, updatedTokens.accessToken, updatedTokens.refreshToken);
        }
      } catch (err) {
        logout();
      } finally {
        isInitializing.current = false;
      }
    };

    validateSession();
  }, []);

  return <>{children}</>;
}

