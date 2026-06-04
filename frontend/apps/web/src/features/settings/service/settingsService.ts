import { usersClient } from "@workspace/api-client";
import type { ProfileResponse, UpdateMeRequest } from "@workspace/types";

export const settingsService = {
  getProfile: async (): Promise<ProfileResponse> => {
    return await usersClient.getMyProfile();
  },

  updateProfile: async (data: UpdateMeRequest) => {
    return await usersClient.updateMe(data);
  },
};
