import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { DeliveryService } from './delivery.service';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
import { UpdateProofDto } from './dto/update-proof.dto';
import { FilterMyDeliveriesDto } from './dto/filter-my-deliveries.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ResponseMessage } from 'src/core/decorators/response-message.decorator';
import type {
  DeliveryDetailResponse,
  DeliveryListResponse,
} from './types/delivery.type';

@Controller('deliveries')
@Roles(Role.DELIVERY)
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get('my')
  @ResponseMessage('responses.delivery.my_list')
  async getMyDeliveries(
    @CurrentUser('sub') driverId: string,
    @Query() filter: FilterMyDeliveriesDto,
  ): Promise<DeliveryListResponse> {
    return this.deliveryService.getMyDeliveries(driverId, filter);
  }

  @Patch(':id/status')
  @ResponseMessage('responses.delivery.status_updated')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryStatusDto,
    @CurrentUser('sub') driverId: string,
  ): Promise<DeliveryDetailResponse> {
    return this.deliveryService.updateMyDeliveryStatus(id, dto, driverId);
  }

  @Patch(':id/proof')
  @ResponseMessage('responses.delivery.proof_updated')
  async updateProof(
    @Param('id') id: string,
    @Body() dto: UpdateProofDto,
    @CurrentUser('sub') driverId: string,
  ): Promise<DeliveryDetailResponse> {
    return this.deliveryService.updateProofImage(
      id,
      dto.fileId,
      dto.recipientName,
      driverId,
    );
  }
}
