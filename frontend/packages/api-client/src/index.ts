import { setupInterceptors } from "./interceptors";
import type { InterceptorConfig } from "./interceptors";
import { http } from "./http";

/**
 * يجب استدعاء هذه الدالة مرة واحدة عند تهيئة التطبيق
 *
 * @example
 * // في main.tsx أو App.tsx
 * import { initApiClient } from "@workspace/api-client";
 * import { useAuthStore } from "@workspace/store";
 *
 * const { logout, accessToken } = useAuthStore.getState();
 * initApiClient({ getAccessToken: () => accessToken, onSessionExpired: logout });
 */
export function initApiClient(config: InterceptorConfig): void {
  setupInterceptors(http, config);
}

export { http };
export * from "./queryClient";
export * from "./auth/auth.client";
export * from "./users/users.client";
export * from "./admin/admin.client";
export * from "./contact/contact.client";
export * from "./utils/getErrorMessage"

