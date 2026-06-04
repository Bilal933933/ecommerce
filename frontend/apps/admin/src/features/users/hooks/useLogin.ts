import { useMutation } from "@tanstack/react-query"
import { authClient } from "@workspace/api-client"

export function useLogin() {
  return useMutation<any, Error, { email: string; password: string }>({
    mutationFn: (data) => authClient.login(data)
  })
}