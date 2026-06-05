import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
import { FilterAdminDeliveriesDto } from './dto/filter-admin-deliveries.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';
import type {
  DeliveryDetailResponse,
  DeliveryListResponse,
} from './types/delivery.type';

@Controller('admin/deliveries')
@Roles(Role.ADMIN)
export class AdminDeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  @ResponseMessage('responses.delivery.created')
  async create(
    @Body() dto: CreateDeliveryDto,
  ): Promise<DeliveryDetailResponse> {
    return this.deliveryService.createDelivery(dto);
  }

  @Get()
  @ResponseMessage('responses.delivery.list')
  async findAll(
    @Query() filter: FilterAdminDeliveriesDto,
  ): Promise<DeliveryListResponse> {
    return this.deliveryService.getAllDeliveries(filter);
  }

  @Get(':id')
  @ResponseMessage('responses.delivery.detail')
  async findOne(@Param('id') id: string): Promise<DeliveryDetailResponse> {
    return this.deliveryService.getDeliveryById(id);
  }

  @Patch(':id')
  @ResponseMessage('responses.delivery.updated')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryDto,
  ): Promise<DeliveryDetailResponse> {
    return this.deliveryService.updateDelivery(id, dto);
  }

  @Patch(':id/status')
  @ResponseMessage('responses.delivery.status_updated')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryStatusDto,
  ): Promise<DeliveryDetailResponse> {
    return this.deliveryService.updateDeliveryStatus(id, dto);
  }
}
