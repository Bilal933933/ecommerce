import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesRepository } from './repository/categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SlugUtil } from 'src/core/utils/slug.util';
import { FilesService } from '../files/services/files.service';
import { I18nService } from 'nestjs-i18n';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CategoryWithRelations,
  CategoryListResponse,
  FindAllCategoriesQuery,
  CategoryWithCount,
} from './types/category.type';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepo: CategoriesRepository,
    private readonly slugUtil: SlugUtil,
    private readonly filesService: FilesService,
    private readonly i18n: I18nService,
  ) {}

  async createCategory(data: CreateCategoryDto): Promise<CategoryWithCount> {
    const { parentId, translations, imageFileId, ...rest } = data;
    const slug = this.slugUtil.generateSlug(translations[0].name);
    const uniqueSlug = await this.slugUtil.ensureUniqueSlug(
      slug,
      this.categoriesRepo,
    );

    const categoryData = {
      ...rest,
      slug: uniqueSlug,
    };
    return this.categoriesRepo.createCategory({
      ...categoryData,
      ...(parentId ? { parent: { connect: { id: parentId } } } : {}),
      ...(imageFileId ? { imageFile: { connect: { id: imageFileId } } } : {}),
      translations: {
        create: translations,
      },
    });
  }

  async attachImageToCategory(
    categoryId: string,
    fileId: string,
  ): Promise<CategoryWithRelations> {
    await this.filesService.attachFiles([fileId], 'category', categoryId);

    return this.categoriesRepo.updateCategory(categoryId, {
      imageFile: { connect: { id: fileId } },
    });
  }

  async findAllCategories(
    query: FindAllCategoriesQuery,
  ): Promise<CategoryListResponse> {
    const { page = 1, limit = 10 } = query;
    const { data, total } = await this.categoriesRepo.findAllCategories(query);

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

  async findCategoryById(id: string): Promise<CategoryWithRelations> {
    const category = await this.categoriesRepo.findCategoryById(id);
    if (!category) {
      throw new NotFoundException(this.i18n.t('errors.categories.not_found'));
    }
    return category;
  }

  async findCategoryBySlug(slug: string): Promise<CategoryWithRelations> {
    const category = await this.categoriesRepo.findCategoryBySlug(slug);
    if (!category) {
      throw new NotFoundException(this.i18n.t('errors.categories.not_found'));
    }
    return category;
  }

  async updateCategory(
    id: string,
    data: UpdateCategoryDto,
  ): Promise<CategoryWithRelations> {
    const { parentId, translations, imageFileId, ...rest } = data;

    const updateData: Record<string, unknown> = {
      ...rest,
    };

    if (parentId !== undefined) {
      updateData.parent = parentId
        ? { connect: { id: parentId } }
        : { disconnect: true };
    }

    if (imageFileId !== undefined) {
      updateData.imageFile = imageFileId
        ? { connect: { id: imageFileId } }
        : { disconnect: true };
    }

    if (translations) {
      updateData.translations = {
        deleteMany: {},
        create: translations,
      };
    }

    return this.categoriesRepo.updateCategory(id, updateData);
  }

  async deactivateCategory(id: string): Promise<CategoryWithCount> {
    const category = await this.categoriesRepo.findCategoryById(id);
    if (!category) {
      throw new NotFoundException(this.i18n.t('errors.categories.not_found'));
    }
    return this.categoriesRepo.deactivateCategory(id);
  }

  async reorderCategory(id: string, order: number): Promise<CategoryWithCount> {
    const category = await this.categoriesRepo.findCategoryById(id);
    if (!category) {
      throw new NotFoundException(this.i18n.t('errors.categories.not_found'));
    }
    return this.categoriesRepo.reorderCategory(id, order);
  }

  async deleteCategory(id: string): Promise<CategoryWithCount> {
    const category = await this.categoriesRepo.findCategoryById(id);
    if (!category) {
      throw new NotFoundException(this.i18n.t('errors.categories.not_found'));
    }

    const { childrenCount, productsCount } =
      await this.categoriesRepo.getCategoryWithChildrenAndProductCount(id);

    if (childrenCount > 0) {
      throw new ConflictException(
        this.i18n.t('errors.categories.has_children'),
      );
    }

    if (productsCount > 0) {
      throw new ConflictException(
        this.i18n.t('errors.categories.has_products'),
      );
    }

    return this.categoriesRepo.deleteCategory(id);
  }
}
