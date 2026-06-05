import { IsOptional, IsObject } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsObject({ message: 'validation.orders.shipping_address_must_be_object' })
  shippingAddress?: Record<string, unknown>;
}
