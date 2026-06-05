import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './repository/categories.repository';
import { CategoriesController } from './categories.controller';
import { FilesModule } from '../files/files.module';
import { SlugUtil } from 'src/core/utils/slug.util';

@Module({
  imports: [FilesModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, SlugUtil, CategoriesRepository],
  exports: [CategoriesService],
})
export class CategoriesModule {}
