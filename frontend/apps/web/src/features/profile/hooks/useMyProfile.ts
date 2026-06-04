import { useQuery } from "@tanstack/react-query"
import { usersClient } from "@workspace/api-client"
import type { ProfileResponse } from "@workspace/types"

export function useMyProfile() {
  return useQuery<ProfileResponse>({
    queryKey: ["users", "me", "profile"],
    queryFn: () => usersClient.getMyProfile(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}
