import { IsInt, Min, Max } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt({ message: 'validation.cart.quantity_must_be_integer' })
  @Min(1, { message: 'validation.cart.quantity_min' })
  @Max(10, { message: 'validation.cart.quantity_max' })
  quantity: number;
}
