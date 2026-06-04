import { AxiosError } from "axios"
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios"
import type { LoginResponse, ApiResponse } from "@workspace/types"
import { useAppStore } from "@workspace/store"

// ─── Types ────────────────────────────────────────────────────────────────────
interface QueuedRequest {
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}

interface RefreshableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export interface InterceptorConfig {
  getAccessToken: () => string | null
  getRefreshToken: () => string | null
  onSessionExpired: () => void
  onSessionRefreshed?: (data: LoginResponse) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function processQueue(
  queue: QueuedRequest[],
  error: unknown,
  http: AxiosInstance,
  config: InternalAxiosRequestConfig
): void {
  queue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(http(config))
    }
  })
}

// ─── Setup ────────────────────────────────────────────────────────────────────

export function setupInterceptors(
  http: AxiosInstance,
  config: InterceptorConfig
): void {
  let isRefreshing = false
  let failedQueue: QueuedRequest[] = []

  // ─── Request Interceptor ──────────────────────────────────────────────────────
  http.interceptors.request.use(
    (requestConfig) => {
      const token = config.getAccessToken()
      const language = useAppStore.getState().language // 👈 الصحيح

      if (token) {
        requestConfig.headers = requestConfig.headers || {}
        requestConfig.headers.Authorization = `Bearer ${token}`
      }

      if (language) {
        requestConfig.headers = requestConfig.headers || {}
        requestConfig.headers["Accept-Language"] = language // أو "lang"
      }

      return requestConfig
    },
    (error) => Promise.reject(error)
  )

  // ─── Response Interceptor ─────────────────────────────────────────────────────
  http.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
      const originalRequest = error.config as
        | RefreshableRequestConfig
        | undefined

      // ── 1. تجاهل أخطاء غير الـ 401 ──────────────────────────────────────
      if (error.response?.status !== 401) {
        return Promise.reject(error)
      }

      // ── 2. تجاهل طلب الـ refresh نفسه لمنع الحلقة اللانهائية ────────────
      if (originalRequest?.url?.includes("/auth/refresh")) {
        config.onSessionExpired()
        return Promise.reject(error)
      }

      // ── 3. تجاهل الطلبات التي سبق تجديدها ──────────────────────────────
      if (originalRequest?._retry) {
        config.onSessionExpired()
        return Promise.reject(error)
      }

      // ── 4. إذا كان التجديد جارياً، أضف الطلب للطابور ───────────────────
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
      }

      // ── 5. ابدأ عملية التجديد ────────────────────────────────────────────
      if (!originalRequest) {
        return Promise.reject(error)
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshResponse = await http.post<ApiResponse<LoginResponse>>(
          "/auth/refresh",
          {
            refreshToken: config.getRefreshToken(),
          }
        )

        if (config.onSessionRefreshed && refreshResponse.data.data) {
          config.onSessionRefreshed(refreshResponse.data.data)
        }

        processQueue(failedQueue, null, http, originalRequest)
        failedQueue = []

        return http(originalRequest)
      } catch (refreshError) {
        processQueue(failedQueue, refreshError, http, originalRequest)
        failedQueue = []

        config.onSessionExpired()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
  )
}
