import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterMyOrdersDto } from './dto/filter-my-orders.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';
import type {
  OrderDetailResponse,
  OrderListResponse,
} from './types/order.type';

@Controller('orders')
@Roles(Role.CUSTOMER)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ResponseMessage('responses.orders.created')
  async createOrder(
    @CurrentUser('sub') userId: string,
    @Body() body: CreateOrderDto,
  ): Promise<OrderDetailResponse> {
    return this.ordersService.createOrder(userId, body);
  }

  @Get()
  @ResponseMessage('responses.orders.list')
  async getMyOrders(
    @CurrentUser('sub') userId: string,
    @Query() filter: FilterMyOrdersDto,
  ): Promise<OrderListResponse> {
    return this.ordersService.getMyOrders(userId, filter);
  }

  @Get(':id')
  @ResponseMessage('responses.orders.detail')
  async getOrderDetail(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
  ): Promise<OrderDetailResponse> {
    return this.ordersService.getOrderDetail(id, userId);
  }
}
