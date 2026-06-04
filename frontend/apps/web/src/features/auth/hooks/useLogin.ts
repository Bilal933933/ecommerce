import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { authClient, getErrorMessage } from "@workspace/api-client"
import { useAppStore, useAuthStore } from "@workspace/store"
import type { LoginRequest } from "@workspace/types"
import { locales } from "@workspace/locales/index"

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
    const { language } = useAppStore()
    const t = locales[language].auth

  return useMutation({
    mutationFn: (data: LoginRequest) => authClient.login(data),

    onSuccess: (response) => {
      setAuth(response.user, response.refreshToken, response.accessToken)
      toast.success(t.login.successMessage)
      navigate("/")
    },

    // useLogin.ts
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, t.login.errorMessage));
    },
  })
}
