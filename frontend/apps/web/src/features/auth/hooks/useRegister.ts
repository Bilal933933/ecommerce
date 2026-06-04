import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authClient, getErrorMessage } from "@workspace/api-client";
import type { RegisterRequest } from "@workspace/types";
import { useAppStore, useAuthStore } from "@workspace/store";
import { locales } from "@workspace/locales/index";

export function useRegister() {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const setAuth = useAuthStore((state) => state.setAuth);
  const t = locales[language].auth;

  return useMutation({
    mutationFn: (data: RegisterRequest) => authClient.register(data),

    onSuccess: (response) => {
      setAuth(response.user, response.accessToken, response.refreshToken);
      toast.success(t.register.successMessage);
      navigate("/auth/verify-email");
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t.register.errorMessage));
    },
  });
}
