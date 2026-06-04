import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient, getErrorMessage } from "@workspace/api-client";
import { useAppStore } from "@workspace/store";
import { locales } from "@workspace/locales/index";

export function useResendVerification() {
  const { language } = useAppStore();
  const t = locales[language].auth;

  return useMutation({
    mutationFn: () => authClient.resendVerification(),

    onSuccess: () => {
      toast.success(t.verifyEmail.resendSuccess);
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t.verifyEmail.errorMessage));
    },
  });
}
