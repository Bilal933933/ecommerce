import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { AuthStore, AuthUser, AuthStatus } from "@workspace/types";

// ─── Initial State ─────────────────────────────────────────────────────────────

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: "idle" as AuthStatus,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => {
          set(
            { user, refreshToken, accessToken, status: "authenticated" },
            false,
            "auth/setAuth"
          );
        },

        setAccessToken: (accessToken: string) => {
          set(
            { accessToken },
            false,
            "auth/setAccessToken"
          );
        },

        setTokens: (accessToken: string, refreshToken: string) => {
          set(
            { accessToken, refreshToken },
            false,
            "auth/setTokens"
          );
        },

        logout: () => {
          set(
            { ...initialState, status: "unauthenticated" },
            false,
            "auth/logout"
          );
        },

        setStatus: (status: AuthStatus) => {
          set({ status }, false, "auth/setStatus");
        },
      }),
      {
        name: "al-bayan-auth-store", // Key for localStorage
      }
    ),
    { name: "AuthStore" }
  )
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectUser = (state: AuthStore) => state.user;
export const selectAccessToken = (state: AuthStore) => state.accessToken;
export const selectRefreshToken = (state: AuthStore) => state.refreshToken;
export const selectStatus = (state: AuthStore) => state.status;
export const selectIsAuthenticated = (state: AuthStore) =>
  state.status === "authenticated" && state.user !== null;
export const selectIsAdmin = (state: AuthStore) =>
  state.user?.role === "ADMIN";