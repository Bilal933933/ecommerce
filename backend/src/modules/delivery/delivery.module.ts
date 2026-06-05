import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { AdminDeliveryController } from './admin-delivery.controller';
import { DeliveryService } from './delivery.service';
import { DeliveryRepository } from './repository/delivery.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DeliveryController, AdminDeliveryController],
  providers: [DeliveryService, DeliveryRepository],
})
export class DeliveryModule {}
