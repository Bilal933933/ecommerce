import type { ApiResponse, ProfileResponse, UpdateMeRequest } from "@workspace/types";
import { http } from "../http";

export interface UpdateMeResult {
  user: ProfileResponse["user"];
  emailChanged: boolean;
}

export interface SetAvatarRequest {
  fileId: string;
}

export interface SetAvatarResult {
  avatarUrl: string;
}

export const usersClient = {
  getMyProfile: async (): Promise<ProfileResponse> => {
    const response = await http.get<ApiResponse<ProfileResponse>>("/users/me/profile");
    return response.data.data!;
  },

  updateMe: async (data: UpdateMeRequest): Promise<UpdateMeResult> => {
    const response = await http.patch<ApiResponse<{ user: ProfileResponse["user"]; emailChanged: boolean }>>(
      "/users/me",
      data,
    );
    return response.data.data!;
  },

  // ─── رفع الصورة (avatar) ────────────────────────────────

  /** طلب Signed URL من Backend لرفع صورة */
  getSignedUrl: async (data: { type: "IMAGE"; mimeType: string; size: number }) => {
    const response = await http.post<ApiResponse<{
      signedUrl: string;
      uploadSessionId: string;
      publicId: string;
    }>>("/users/me/files/signed-url", data);
    return response.data.data!;
  },

  /** تأكيد الرفع وربط المالك تلقائياً */
  confirmUpload: async (data: {
    url: string;
    publicId: string;
    uploadSessionId: string;
    type: "IMAGE";
    size: number;
    mimeType: string;
  }) => {
    const response = await http.post<ApiResponse<{
      id: string;
      url: string;
      type: "IMAGE";
      size: number;
      mimeType: string;
    }>>("/users/me/files/confirm", data);
    return response.data.data!;
  },

  /** رفع مباشر إلى Cloudinary (مع تتبع التقدم) */
  uploadToCloudinary: (
    signedUrl: string,
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<{ url: string; publicId: string }> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve({ url: response.secure_url, publicId: response.public_id });
        } else {
          reject(new Error("فشل رفع الملف"));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("فشل الاتصال")));

      xhr.open("POST", signedUrl);
      const formData = new FormData();
      formData.append("file", file);
      xhr.send(formData);
    });
  },

  /** تعيين الأفاتار من fileId تم رفعه مسبقاً */
  setAvatar: async (data: SetAvatarRequest): Promise<SetAvatarResult> => {
    const response = await http.post<ApiResponse<SetAvatarResult>>(
      "/users/me/avatar",
      data,
    );
    return response.data.data!;
  },

  /** حذف الأفاتار الحالي */
  removeAvatar: async (): Promise<void> => {
    await http.delete("/users/me/avatar");
  },

  /** حذف الحساب (soft delete) */
  deleteAccount: async (): Promise<void> => {
    await http.delete("/users/me");
  },
};
