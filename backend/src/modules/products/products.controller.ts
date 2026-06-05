import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Role, ProductStatus } from '@prisma/client';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import {
  ProductWithRelations,
  ProductListResponse,
} from './types/product.type';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ─── Products ──────────────────────────────────────────────

  @Post()
  @Roles(Role.ADMIN)
  @ResponseMessage('responses.products.created')
  createProduct(@Body() body: CreateProductDto): Promise<ProductWithRelations> {
    return this.productsService.createProduct(body);
  }

  @Get()
  @Public()
  @ResponseMessage('responses.products.list')
  findAllProducts(
    @Query() filter: FilterProductDto,
  ): Promise<ProductListResponse> {
    return this.productsService.findAllProducts(filter);
  }

  @Get(':slug')
  @Public()
  @ResponseMessage('responses.products.detail')
  findProductBySlug(
    @Param('slug') slug: string,
  ): Promise<ProductWithRelations> {
    return this.productsService.findProductBySlug(slug);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ResponseMessage('responses.products.updated')
  updateProduct(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
  ): Promise<ProductWithRelations> {
    return this.productsService.updateProduct(id, body);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ResponseMessage('responses.products.updated')
  updateProductStatus(
    @Param('id') id: string,
    @Body('status') status: ProductStatus,
  ): Promise<ProductWithRelations> {
    return this.productsService.updateProductStatus(id, status);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.products.deleted')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productsService.deleteProduct(id);
  }

  // ─── Variants ──────────────────────────────────────────────

  @Post(':id/variants')
  @Roles(Role.ADMIN)
  @ResponseMessage('responses.products.variant_created')
  createVariant(@Param('id') id: string, @Body() body: CreateVariantDto) {
    return this.productsService.createVariant(id, body);
  }

  @Patch(':id/variants/:variantId')
  @Roles(Role.ADMIN)
  @ResponseMessage('responses.products.variant_updated')
  updateVariant(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
    @Body() body: UpdateVariantDto,
  ) {
    return this.productsService.updateVariant(id, variantId, body);
  }

  @Delete(':id/variants/:variantId')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.products.variant_deleted')
  async deleteVariant(
    @Param('id') id: string,
    @Param('variantId') variantId: string,
  ): Promise<void> {
    return this.productsService.deleteVariant(id, variantId);
  }

  // ─── Images ────────────────────────────────────────────────

  @Post(':id/images')
  @Roles(Role.ADMIN)
  @ResponseMessage('responses.products.images_added')
  addImages(@Param('id') id: string, @Body('fileIds') fileIds: string[]) {
    return this.productsService.addImages(id, fileIds);
  }

  @Delete(':id/images/:imageId')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.products.image_deleted')
  deleteImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.productsService.deleteImage(id, imageId);
  }
}
