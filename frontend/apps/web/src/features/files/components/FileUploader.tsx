import { useCallback, useRef } from 'react';
import { useFileUpload }       from '../hooks/useFileUpload';
import { Button }              from '@workspace/ui/index';
import type { FileType } from '@workspace/api-client/files/files.client';
import type { ConfirmedFile } from '@workspace/types/file.types';
import { useAppStore } from '@workspace/store';
import { locales } from '@workspace/locales';

const ACCEPT_MAP: Record<FileType, string> = {
  IMAGE:    'image/jpeg,image/png,image/webp,image/gif',
  VIDEO:    'video/mp4,video/webm,video/quicktime',
  AUDIO:    'audio/mpeg,audio/wav,audio/ogg',
  DOCUMENT: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

interface FileUploaderProps {
  type:          FileType;
  label?:        string;
  onUpload:      (file: ConfirmedFile) => void;
  onDelete?:     (fileId: string) => void;
  currentFileId?: string;
  currentFileUrl?: string;
  disabled?:     boolean;
}

export function FileUploader({
  type,
  label,
  onUpload,
  onDelete,
  currentFileId,
  currentFileUrl,
  disabled = false,
}: FileUploaderProps) {
  const inputRef               = useRef<HTMLInputElement>(null);
  const { upload, deleteFile, state, resetState } = useFileUpload();
  const { language } = useAppStore();
  const t = locales[language].fileAdmin;

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const confirmed = await upload(file, type);
      if (confirmed) {
        onUpload(confirmed);
      }

      if (inputRef.current) inputRef.current.value = '';
    },
    [upload, type, onUpload],
  );

  const handleDelete = useCallback(async () => {
    if (!currentFileId) return;
    await deleteFile(currentFileId);
    onDelete?.(currentFileId);
    resetState();
  }, [currentFileId, deleteFile, onDelete, resetState]);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={`file-upload-${type}`} className="text-sm font-medium text-foreground">{label}</label>

      {currentFileUrl && (
        <div className="flex items-center gap-2 rounded-md border border-border p-2">
          {type === 'IMAGE' && (
            <img
              src={currentFileUrl}
              alt={t.preview}
              className="h-16 w-16 rounded object-cover"
            />
          )}
          {type !== 'IMAGE' && (
            <a
              href={currentFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary underline"
            >
              {t.viewFile}
            </a>
          )}
          {onDelete && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={state.isUploading || disabled}
            >
              {t.delete}
            </Button>
          )}
        </div>
      )}

      {!currentFileUrl && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_MAP[type]}
            onChange={handleFileChange}
            disabled={state.isUploading || disabled}
            className="hidden"
            id={`file-upload-${type}`}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={state.isUploading || disabled}
          >
            {state.isUploading ? `${t.uploading} ${state.progress}%` : t.chooseFile}
          </Button>
        </div>
      )}

      {state.isUploading && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${state.progress}%` }}
          />
        </div>
      )}

      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}
    </div>
  );
}
