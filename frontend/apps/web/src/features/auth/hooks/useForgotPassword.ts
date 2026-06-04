import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient, getErrorMessage } from "@workspace/api-client";
import type { ForgotPasswordRequest } from "@workspace/types";
import { useAppStore } from "@workspace/store";
import { locales } from "@workspace/locales/index";

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useForgotPassword() {
  const { language } = useAppStore();
  const t = locales[language].auth;

  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      authClient.forgotPassword(data),

    onSuccess: () => {
      toast.success(t.forgotPassword.successMessage);
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t.forgotPassword.errorMessage));
    },
  });
}
