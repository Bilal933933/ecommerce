// src/modules/files/repositories/files.repository.ts

import { Injectable } from '@nestjs/common';
import { FileStatus, FileType } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { RelatedType } from '../types/file.types';

@Injectable()
export class FilesRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ─── إنشاء ملف جديد بـ status: PENDING ───────────────────
  async create(data: {
    url: string;
    publicId: string;
    type: FileType;
    size: number;
    mimeType: string;
    uploadSessionId: string;
    ownerId?: string;
  }) {
    return await this.prisma.file.create({ data });
  }

  // ─── جلب ملفات بالـ IDs ────────────────────────────────────
  async findByIds(ids: string[]) {
    return await this.prisma.file.findMany({
      where: { id: { in: ids } },
    });
  }

  // ─── تحديث ownerId للملف (يُستخدم بعد الـ confirm لتحديد المالك) ──
  async setOwner(fileId: string, ownerId: string) {
    return await this.prisma.file.update({
      where: { id: fileId },
      data: { ownerId },
    });
  }

  // ─── جلب ملف مملوك لمستخدم معيّن ────────────────────────
  async findByIdAndOwner(fileId: string, ownerId: string) {
    return await this.prisma.file.findFirst({
      where: { id: fileId, ownerId },
    });
  }

  // ─── جلب ملف بالـ URL + ownerId (لحذف الأفاتار القديم) ──
  async findByUrlAndOwner(url: string, ownerId: string) {
    return await this.prisma.file.findFirst({
      where: { url, ownerId },
    });
  }

  // ─── جلب ملف واحد ─────────────────────────────────────────
  async findById(id: string) {
    return await this.prisma.file.findUnique({
      where: { id },
    });
  }

  // ─── ربط الملفات بكيان ────────────────────────────────────
  async attachToEntity(
    fileIds: string[],
    relatedType: RelatedType,
    relatedId: string,
  ) {
    return await this.prisma.file.updateMany({
      where: {
        id: { in: fileIds },
        OR: [{ status: FileStatus.PENDING }, { status: FileStatus.ACTIVE }],
      },
      data: { status: FileStatus.ACTIVE, relatedType, relatedId },
    });
  }

  // ─── فك ربط الملفات عند حذف الكيان ───────────────────────
  async detachFromEntity(relatedType: RelatedType, relatedId: string) {
    return await this.prisma.file.updateMany({
      where: { relatedType, relatedId, status: FileStatus.ACTIVE },
      data: { status: FileStatus.ORPHAN, relatedType: null, relatedId: null },
    });
  }

  // ─── جلب publicIds لكيان معين (للحذف) ────────────────────
  async findPublicIdsByEntity(relatedType: RelatedType, relatedId: string) {
    const files = await this.prisma.file.findMany({
      where: { relatedType, relatedId },
      select: { id: true, publicId: true },
    });
    return files;
  }

  // ─── جلب ملفات لكيان معين ──────────────────────────────
  async findFilesByEntity(relatedType: RelatedType, relatedId: string) {
    return this.prisma.file.findMany({
      where: { relatedType, relatedId, status: FileStatus.ACTIVE },
      select: {
        id: true,
        url: true,
        type: true,
        size: true,
        mimeType: true,
      },
    });
  }

  // ─── جلب ملفات لعدة كيانات ─────────────────────────────
  async findFilesByEntities(relatedType: RelatedType, relatedIds: string[]) {
    return this.prisma.file.findMany({
      where: {
        relatedType,
        relatedId: { in: relatedIds },
        status: FileStatus.ACTIVE,
      },
      select: {
        id: true,
        url: true,
        type: true,
        size: true,
        mimeType: true,
        relatedId: true,
      },
    });
  }

  // ─── حذف ملفات بالـ IDs ───────────────────────────────────
  async deleteByIds(ids: string[]) {
    return this.prisma.file.deleteMany({
      where: { id: { in: ids } },
    });
  }

  // ─── جلب الملفات اليتيمة (للـ Cleanup لاحقاً) ────────────
  async findOrphans(olderThanMinutes: number) {
    const cutoff = new Date(Date.now() - olderThanMinutes * 60 * 1000);
    return this.prisma.file.findMany({
      where: {
        OR: [{ status: FileStatus.PENDING }, { status: FileStatus.ORPHAN }],
        createdAt: { lt: cutoff },
      },
      select: { id: true, publicId: true },
    });
  }
}
