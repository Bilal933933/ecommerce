import type { ApiResponse } from "@workspace/types";
import { http } from "../http";

export const contactClient = {
  send: async (data: { name: string; email: string; message: string }): Promise<void> => {
    await http.post<ApiResponse<{ sent: boolean }>>("/contact", data);
  },
};
