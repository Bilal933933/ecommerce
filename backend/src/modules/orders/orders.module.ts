import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { AdminOrdersController } from './admin-orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './repository/orders.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [PrismaModule, CartModule],
  controllers: [OrdersController, AdminOrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersRepository],
})
export class OrdersModule {}
