import { Controller, Get, Patch, Body, Param, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { FilterAdminOrdersDto } from './dto/filter-admin-orders.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';
import type {
  OrderDetailResponse,
  OrderListResponse,
} from './types/order.type';

@Controller('admin/orders')
@Roles(Role.ADMIN)
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ResponseMessage('responses.orders.admin_list')
  async getAllOrders(
    @Query() filter: FilterAdminOrdersDto,
  ): Promise<OrderListResponse> {
    return this.ordersService.getAllOrders(filter);
  }

  @Patch(':id/status')
  @ResponseMessage('responses.orders.status_updated')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() body: UpdateOrderStatusDto,
    @CurrentUser('sub') adminId: string,
  ): Promise<OrderDetailResponse> {
    return this.ordersService.updateOrderStatus(id, body, adminId);
  }
}
