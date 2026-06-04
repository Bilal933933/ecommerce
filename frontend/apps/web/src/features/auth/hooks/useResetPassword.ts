import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authClient, getErrorMessage } from "@workspace/api-client";
import type { ResetPasswordRequest } from "@workspace/types";
import { useAppStore } from "@workspace/store";
import { locales } from "@workspace/locales/index";

export function useResetPassword() {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const t = locales[language].auth;

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) =>
      authClient.resetPassword(data),

    onSuccess: () => {
      toast.success(t.resetPassword.successMessage);
      navigate("/auth/login");
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t.resetPassword.errorMessage));
    },
  });
}
