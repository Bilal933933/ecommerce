import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ProductStatus } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { ProductsRepository } from './repository/products.repository';
import { VariantsRepository } from './repository/variants.repository';
import { SlugUtil } from 'src/core/utils/slug.util';
import { FilesService } from '../files/services/files.service';
import {
  ProductWithRelations,
  ProductListResponse,
  FilterProductQuery,
} from './types/product.type';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepo: ProductsRepository,
    private readonly variantsRepo: VariantsRepository,
    private readonly slugUtil: SlugUtil,
    private readonly filesService: FilesService,
    private readonly i18n: I18nService,
  ) {}

  async createProduct(data: CreateProductDto): Promise<ProductWithRelations> {
    const {
      translations,
      attributes,
      variants,
      imageFileIds,
      categoryId,
      ...rest
    } = data;
    const slug = this.slugUtil.generateSlug(translations[0].name);
    const uniqueSlug = await this.slugUtil.ensureUniqueSlug(
      slug,
      this.productsRepo,
    );

    return this.productsRepo.createProduct({
      ...rest,
      slug: uniqueSlug,
      ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
      translations: {
        create: translations,
      },
      ...(attributes
        ? {
            attributes: {
              create: attributes.map((attr) => ({
                order: attr.order ?? 0,
                translations: {
                  create: attr.translations,
                },
                values: {
                  create: attr.values.map((val) => ({
                    order: val.order ?? 0,
                    translations: {
                      create: val.translations,
                    },
                  })),
                },
              })),
            },
          }
        : {}),
      ...(variants
        ? {
            variants: {
              create: variants.map((variant) => ({
                sku: variant.sku,
                price: variant.price,
                comparePrice: variant.comparePrice,
                stock: variant.stock ?? 0,
                isDefault: variant.isDefault ?? false,
                variantValues: variant.attributeValueIds
                  ? {
                      create: variant.attributeValueIds.map((valueId) => ({
                        value: { connect: { id: valueId } },
                      })),
                    }
                  : undefined,
              })),
            },
          }
        : {}),
      ...(imageFileIds && imageFileIds.length > 0
        ? {
            images: {
              create: imageFileIds.map((fileId, idx) => ({
                file: { connect: { id: fileId } },
                order: idx,
                isMain: idx === 0,
              })),
            },
          }
        : {}),
    });
  }

  async findAllProducts(
    filter: FilterProductDto,
  ): Promise<ProductListResponse> {
    const { page = 1, limit = 10 } = filter;
    const query: FilterProductQuery = {
      page,
      limit,
      ...(filter.search ? { search: filter.search } : {}),
      ...(filter.type ? { type: filter.type } : {}),
      ...(filter.status ? { status: filter.status } : {}),
      ...(filter.categoryId ? { categoryId: filter.categoryId } : {}),
    };

    const { data, total } = await this.productsRepo.findAllProducts(query);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findProductBySlug(slug: string): Promise<ProductWithRelations> {
    const product = await this.productsRepo.findProductBySlug(slug);
    if (!product) {
      throw new NotFoundException(this.i18n.t('errors.products.not_found'));
    }
    return product;
  }

  async findProductById(id: string): Promise<ProductWithRelations> {
    const product = await this.productsRepo.findProductById(id);
    if (!product) {
      throw new NotFoundException(this.i18n.t('errors.products.not_found'));
    }
    return product;
  }

  async updateProduct(
    id: string,
    data: UpdateProductDto,
  ): Promise<ProductWithRelations> {
    const product = await this.productsRepo.findProductById(id);
    if (!product) {
      throw new NotFoundException(this.i18n.t('errors.products.not_found'));
    }

    const { translations, imageFileIds, categoryId, ...rest } = data;
    const updateData: Record<string, unknown> = { ...rest };

    if (categoryId !== undefined) {
      updateData.category = categoryId
        ? { connect: { id: categoryId } }
        : { disconnect: true };
    }

    if (translations) {
      updateData.translations = {
        deleteMany: {},
        create: translations,
      };
    }

    if (imageFileIds) {
      updateData.images = {
        deleteMany: {},
        create: imageFileIds.map((fileId, idx) => ({
          file: { connect: { id: fileId } },
          order: idx,
          isMain: idx === 0,
        })),
      };
    }

    return this.productsRepo.updateProduct(id, updateData);
  }

  async updateProductStatus(
    id: string,
    status: ProductStatus,
  ): Promise<ProductWithRelations> {
    const product = await this.productsRepo.findProductById(id);
    if (!product) {
      throw new NotFoundException(this.i18n.t('errors.products.not_found'));
    }
    return this.productsRepo.updateProduct(id, { status });
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productsRepo.findProductById(id);
    if (!product) {
      throw new NotFoundException(this.i18n.t('errors.products.not_found'));
    }
    if (product._count.orderItems > 0) {
      throw new ConflictException(this.i18n.t('errors.products.has_orders'));
    }
    await this.productsRepo.deleteProduct(id);
  }

  // ─── Variants ──────────────────────────────────────────────

  async createVariant(productId: string, data: CreateVariantDto) {
    const product = await this.productsRepo.findProductById(productId);
    if (!product) {
      throw new NotFoundException(this.i18n.t('errors.products.not_found'));
    }

    return this.variantsRepo.createVariant(productId, {
      sku: data.sku,
      price: data.price,
      comparePrice: data.comparePrice,
      stock: data.stock ?? 0,
      isDefault: data.isDefault ?? false,
      ...(data.attributeValueIds
        ? {
            variantValues: {
              create: data.attributeValueIds.map((valueId) => ({
                value: { connect: { id: valueId } },
              })),
            },
          }
        : {}),
    });
  }

  async updateVariant(
    productId: string,
    variantId: string,
    data: UpdateVariantDto,
  ) {
    const variant = await this.variantsRepo.findVariantById(variantId);
    if (!variant || variant.productId !== productId) {
      throw new NotFoundException(
        this.i18n.t('errors.products.variant_not_found'),
      );
    }

    const updateData: Record<string, unknown> = {};
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.comparePrice !== undefined)
      updateData.comparePrice = data.comparePrice;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.isDefault !== undefined) updateData.isDefault = data.isDefault;

    return this.variantsRepo.updateVariant(variantId, updateData);
  }

  async deleteVariant(productId: string, variantId: string): Promise<void> {
    const variant = await this.variantsRepo.findVariantById(variantId);
    if (!variant || variant.productId !== productId) {
      throw new NotFoundException(
        this.i18n.t('errors.products.variant_not_found'),
      );
    }

    const ordersCount =
      await this.variantsRepo.countOrdersForVariant(variantId);

    if (ordersCount > 0) {
      await this.variantsRepo.softDeleteVariant(variantId);
    } else {
      await this.variantsRepo.hardDeleteVariant(variantId);
    }
  }

  // ─── Images ────────────────────────────────────────────────

  async addImages(productId: string, fileIds: string[]) {
    const product = await this.productsRepo.findProductById(productId);
    if (!product) {
      throw new NotFoundException(this.i18n.t('errors.products.not_found'));
    }

    if (!fileIds || fileIds.length === 0) {
      throw new BadRequestException(
        this.i18n.t('errors.products.no_files_provided'),
      );
    }

    const currentImagesCount = product.images?.length ?? 0;

    return this.productsRepo.updateProduct(productId, {
      images: {
        create: fileIds.map((fileId, idx) => ({
          file: { connect: { id: fileId } },
          order: currentImagesCount + idx,
          isMain: currentImagesCount === 0 && idx === 0,
        })),
      },
    });
  }

  async deleteImage(
    productId: string,
    imageId: string,
  ): Promise<ProductWithRelations> {
    const product = await this.productsRepo.findProductById(productId);
    if (!product) {
      throw new NotFoundException(this.i18n.t('errors.products.not_found'));
    }

    return this.productsRepo.updateProduct(productId, {
      images: {
        delete: { id: imageId },
      },
    });
  }
}
