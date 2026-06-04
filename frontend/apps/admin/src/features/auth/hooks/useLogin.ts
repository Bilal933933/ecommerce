import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authClient, getErrorMessage } from "@workspace/api-client";
import { useAuthStore } from "@workspace/store";
import type { LoginRequest } from "@workspace/types";
import { useAppStore } from "@workspace/store"
import { locales } from "@workspace/locales/index";

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
    const { language } = useAppStore();
    const t = locales[language].auth

  return useMutation({
    mutationFn: (data: LoginRequest) => {
      const requestData = data;
      console.log(requestData);
      return authClient.login(requestData);
    },

    onSuccess: (response) => {
      const responseData = response;
      console.log("Success response:", responseData);
      setAuth(responseData.user, responseData.accessToken, responseData.refreshToken);
      toast.success(t.login.successMessage);
      navigate("/dashboard");
    },

    // useLogin.ts
        onError: (error: unknown) => {
          toast.error(getErrorMessage(error, t.login.errorMessage));
        },

  });
}