// apps/admin/src/features/files/hooks/useFileUpload.ts

import { useState } from 'react';
import { filesClient, type FileType } from '@workspace/api-client/files/files.client';
import type { ConfirmedFile } from '@workspace/types/file.types';
import { useAppStore } from '@workspace/store';
import { locales } from '@workspace/locales';


interface UploadState {
  isUploading: boolean;
  progress:    number;
  error:       string | null;
}

interface UseFileUploadReturn {
  upload:      (file: File, type: FileType) => Promise<ConfirmedFile | null>;
  deleteFile:  (fileId: string) => Promise<void>;
  state:       UploadState;
  resetState:  () => void;
}

const INITIAL_STATE: UploadState = {
  isUploading: false,
  progress:    0,
  error:       null,
};

export function useFileUpload(): UseFileUploadReturn {
  const [state, setState] = useState<UploadState>(INITIAL_STATE);
  const { language } = useAppStore();
  const t = locales[language].fileAdmin;

  const upload = async (
    file: File,
    type: FileType,
  ): Promise<ConfirmedFile | null> => {
    setState({ isUploading: true, progress: 0, error: null });

    try {
      // ١) طلب Signed URL
      const { signedUrl, uploadSessionId, publicId } =
        await filesClient.admin.getSignedUrl({
          type,
          mimeType: file.type,
          size:     file.size,
        });

      // ٢) رفع مباشر لـ Cloudinary مع تتبع التقدم
      const { url } = await filesClient.admin.uploadToCloudinary(
        signedUrl,
        file,
        (percent) => setState((prev) => ({ ...prev, progress: percent })),
      );

      // ٣) تأكيد الرفع وحفظ في DB
      const confirmedFile = await filesClient.admin.confirmUpload({
        url,
        publicId,
        uploadSessionId,
        type,
        size:     file.size,
        mimeType: file.type,
      });

      setState({ isUploading: false, progress: 100, error: null });
      return confirmedFile;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t.uploadFailed;
      setState({ isUploading: false, progress: 0, error: message });
      return null;
    }
  };

  const deleteFile = async (fileId: string): Promise<void> => {
    try {
      await filesClient.admin.deleteFile(fileId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t.deleteFailed;
      setState((prev) => ({ ...prev, error: message }));
    }
  };

  const resetState = () => setState(INITIAL_STATE);

  return { upload, deleteFile, state, resetState };
}
