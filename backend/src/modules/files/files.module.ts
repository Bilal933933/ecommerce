// src/modules/files/files.module.ts

import { Module } from '@nestjs/common';
import { FilesService } from './services/files.service';
import { CloudinaryService } from './services/cloudinary.service';
import { FilesRepository } from './repositories/files.repository';
import { FilesAdminController } from './controllers/files-admin.controller';

@Module({
  controllers: [FilesAdminController],
  providers: [FilesService, CloudinaryService, FilesRepository],
  // نصدّر FilesService لأن باقي الموديولات ستستخدمه
  exports: [FilesService],
})
export class FilesModule {}
