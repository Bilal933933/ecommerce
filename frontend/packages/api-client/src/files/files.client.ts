// packages/api-client/src/files/files.client.ts

import type { ApiResponse } from '@workspace/types/api';
import { http } from '../http';;
import type {
  SignedUrlResponse,
  ConfirmedFile,
} from '@workspace/types/file.types';

export type FileType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';

interface SignedUrlRequest {
  type:     FileType;
  mimeType: string;
  size:     number;
}

interface ConfirmUploadRequest {
  url:             string;
  publicId:        string;
  uploadSessionId: string;
  type:            FileType;
  size:            number;
  mimeType:        string;
}

export const filesClient = {
  admin: {
    // ─── طلب Signed URL ─────────────────────────────────────
    getSignedUrl: async (data: SignedUrlRequest): Promise<SignedUrlResponse> => {
      const response = await http.post<ApiResponse<SignedUrlResponse>>(
        '/admin/files/signed-url',
        data,
      );
      return response.data.data!;
    },

    // ─── رفع مباشر لـ Cloudinary ────────────────────────────
    uploadToCloudinary: async (
      signedUrl: string,
      file:      File,
      onProgress?: (percent: number) => void,
    ): Promise<{ url: string; publicId: string }> => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve({
              url:      response.secure_url,
              publicId: response.public_id,
            });
          } else {
            reject(new Error('فشل رفع الملف'));
          }
        });

        xhr.addEventListener('error', () => reject(new Error('فشل الاتصال')));

        xhr.open('POST', signedUrl);
        const formData = new FormData();
        formData.append('file', file);
        xhr.send(formData);
      });
    },

    // ─── تأكيد الرفع ────────────────────────────────────────
    confirmUpload: async (data: ConfirmUploadRequest): Promise<ConfirmedFile> => {
      const response = await http.post<ApiResponse<ConfirmedFile>>(
        '/admin/files/confirm',
        data,
      );
      return response.data.data!;
    },

    // ─── حذف ملف ────────────────────────────────────────────
    deleteFile: async (fileId: string): Promise<void> => {
      await http.delete(`/admin/files/${fileId}`);
    },
  },
};