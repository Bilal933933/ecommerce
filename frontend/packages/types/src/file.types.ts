// packages/types/src/file.types.ts

export type FileType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';

export type FileStatus = 'PENDING' | 'ACTIVE' | 'ORPHAN';

export type RelatedType = 'grade' | 'level' | 'lesson' | 'exam';

export interface AppFile {
  id: string;
  url: string;
  publicId: string;
  type: FileType;
  size: number;
  mimeType: string;
  status: FileStatus;
  uploadSessionId: string;
  relatedType: RelatedType | null;
  relatedId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ما يُرجع للـ Frontend بعد التأكيد
export interface ConfirmedFile {
  id: string;
  url: string;
  type: FileType;
  size: number;
  mimeType: string;
}

// ما يُرجع من طلب Signed URL
export interface SignedUrlResponse {
  signedUrl: string;
  uploadSessionId: string;
  publicId: string;
}

// طلب ربط الملفات بكيان
export interface AttachFilesRequest {
  fileIds: string[];
  relatedType: RelatedType;
  relatedId: string;
}