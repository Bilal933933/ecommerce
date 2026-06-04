import type { AdminDashboardStats } from "@workspace/types";
import type { ApiResponse } from "@workspace/types";
import { http } from "../http";

export const adminClient = {
  getDashboard: async () => {
    const response = await http.get<ApiResponse<AdminDashboardStats>>("/admin/dashboard");
    return response.data.data!;
  },
};
