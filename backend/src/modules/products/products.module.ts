import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsRepository } from './repository/products.repository';
import { VariantsRepository } from './repository/variants.repository';
import { ProductsController } from './products.controller';
import { FilesModule } from '../files/files.module';
import { SlugUtil } from 'src/core/utils/slug.util';

@Module({
  imports: [FilesModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsRepository,
    VariantsRepository,
    SlugUtil,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
