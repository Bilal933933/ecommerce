/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Prisma } from '@prisma/client';
import { CartRepository } from './repository/cart.repository';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import type { CartItemResponse, CartResponse } from './types/cart.type';

const MAX_QUANTITY_PER_ITEM = 10;

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly i18n: I18nService,
  ) {}

  async getCart(userId: string): Promise<CartResponse> {
    const cartWithItems = await this.cartRepo.findCartWithItems(userId);
    if (!cartWithItems) {
      const cart = await this.cartRepo.findOrCreateCart(userId);
      return { id: cart.id, items: [], total: 0 };
    }

    const items: CartItemResponse[] = cartWithItems.items.map((item) => {
      const currentPrice = Number(item.variant.price);
      const priceAtAdd = Number(item.priceAtAdd);

      return {
        id: item.id,
        variantId: item.variantId,
        productId: item.productId,
        quantity: item.quantity,
        priceAtAdd,
        currentPrice,
        isPriceChanged: priceAtAdd !== currentPrice,
        variant: {
          id: item.variant.id,
          sku: item.variant.sku,
          price: currentPrice,
          comparePrice: item.variant.comparePrice
            ? Number(item.variant.comparePrice)
            : null,
          stock: item.variant.stock,
          isDefault: item.variant.isDefault,
          product: {
            id: item.variant.product.id,
            type: item.variant.product.type,
            translations: item.variant.product.translations.map((t) => ({
              id: t.id,
              name: t.name,
              locale: t.locale,
            })),
            image: item.variant.product.images?.[0]
              ? {
                  id: item.variant.product.images[0].file.id,
                  url: item.variant.product.images[0].file.url,
                }
              : null,
          },
        },
      };
    });

    const total = items.reduce(
      (sum, item) => sum + item.currentPrice * item.quantity,
      0,
    );

    return { id: cartWithItems.id, items, total };
  }

  async addItem(userId: string, dto: AddCartItemDto): Promise<CartResponse> {
    const variant = await this.cartRepo.findVariant(dto.variantId);
    if (!variant) {
      throw new NotFoundException(this.i18n.t('errors.cart.variant_not_found'));
    }

    if (variant.product.type !== 'DIGITAL') {
      if (variant.stock < dto.quantity) {
        throw new ConflictException(
          this.i18n.t('errors.cart.insufficient_stock', {
            args: { quantity: dto.quantity, stock: variant.stock },
          }),
        );
      }
    }

    const cart = await this.cartRepo.findOrCreateCart(userId);

    const existingItem = await this.cartRepo.findCartItem(
      cart.id,
      dto.variantId,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;
      if (newQuantity > MAX_QUANTITY_PER_ITEM) {
        throw new BadRequestException(
          this.i18n.t('errors.cart.max_quantity_exceeded', {
            args: { max: MAX_QUANTITY_PER_ITEM },
          }),
        );
      }

      if (variant.product.type !== 'DIGITAL' && variant.stock < newQuantity) {
        throw new ConflictException(
          this.i18n.t('errors.cart.insufficient_stock', {
            args: { quantity: newQuantity, stock: variant.stock },
          }),
        );
      }

      await this.cartRepo.updateItemQuantity(existingItem.id, newQuantity);
    } else {
      await this.cartRepo.addItem(
        cart.id,
        dto.variantId,
        variant.product.id,
        dto.quantity,
        new Prisma.Decimal(Number(variant.price)),
      );
    }

    return this.getCart(userId);
  }

  async updateItemQuantity(
    userId: string,
    itemId: string,
    dto: UpdateCartItemDto,
  ): Promise<CartResponse> {
    const cart = await this.cartRepo.findCartWithItems(userId);
    if (!cart) {
      throw new NotFoundException(this.i18n.t('errors.cart.not_found'));
    }

    const item = cart.items.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundException(this.i18n.t('errors.cart.item_not_found'));
    }

    const variant = await this.cartRepo.findVariant(item.variantId);
    if (!variant) {
      throw new NotFoundException(this.i18n.t('errors.cart.variant_not_found'));
    }

    if (dto.quantity > MAX_QUANTITY_PER_ITEM) {
      throw new BadRequestException(
        this.i18n.t('errors.cart.max_quantity_exceeded', {
          args: { max: MAX_QUANTITY_PER_ITEM },
        }),
      );
    }

    if (variant.product.type !== 'DIGITAL' && variant.stock < dto.quantity) {
      throw new ConflictException(
        this.i18n.t('errors.cart.insufficient_stock', {
          args: { quantity: dto.quantity, stock: variant.stock },
        }),
      );
    }

    await this.cartRepo.updateItemQuantity(itemId, dto.quantity);

    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string): Promise<CartResponse> {
    const cart = await this.cartRepo.findCartWithItems(userId);
    if (!cart) {
      throw new NotFoundException(this.i18n.t('errors.cart.not_found'));
    }

    const item = cart.items.find((i) => i.id === itemId);
    if (!item) {
      throw new NotFoundException(this.i18n.t('errors.cart.item_not_found'));
    }

    await this.cartRepo.removeItem(itemId);

    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.cartRepo.findOrCreateCart(userId);
    await this.cartRepo.clearCart(cart.id);
  }
}
