import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';
import type { CartResponse } from './types/cart.type';

@Controller('cart')
@Roles(Role.CUSTOMER)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ResponseMessage('responses.cart.retrieved')
  getCart(@CurrentUser('sub') userId: string): Promise<CartResponse> {
    return this.cartService.getCart(userId);
  }

  @Post('items')
  @ResponseMessage('responses.cart.item_added')
  addItem(
    @CurrentUser('sub') userId: string,
    @Body() body: AddCartItemDto,
  ): Promise<CartResponse> {
    return this.cartService.addItem(userId, body);
  }

  @Patch('items/:itemId')
  @ResponseMessage('responses.cart.item_updated')
  updateItem(
    @CurrentUser('sub') userId: string,
    @Param('itemId') itemId: string,
    @Body() body: UpdateCartItemDto,
  ): Promise<CartResponse> {
    return this.cartService.updateItemQuantity(userId, itemId, body);
  }

  @Delete('items/:itemId')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.cart.item_removed')
  removeItem(
    @CurrentUser('sub') userId: string,
    @Param('itemId') itemId: string,
  ): Promise<CartResponse> {
    return this.cartService.removeItem(userId, itemId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('responses.cart.cleared')
  async clearCart(@CurrentUser('sub') userId: string): Promise<void> {
    return this.cartService.clearCart(userId);
  }
}
