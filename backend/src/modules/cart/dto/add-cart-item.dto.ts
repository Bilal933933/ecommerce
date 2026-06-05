import { IsUUID, IsInt, Min, Max } from 'class-validator';

export class AddCartItemDto {
  @IsUUID(undefined, { message: 'validation.cart.variant_id_must_be_uuid' })
  variantId: string;

  @IsInt({ message: 'validation.cart.quantity_must_be_integer' })
  @Min(1, { message: 'validation.cart.quantity_min' })
  @Max(10, { message: 'validation.cart.quantity_max' })
  quantity: number;
}
