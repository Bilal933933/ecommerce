export type CartItemResponse = {
  id: string;
  variantId: string;
  productId: string;
  quantity: number;
  priceAtAdd: number;
  currentPrice: number;
  isPriceChanged: boolean;
  variant: {
    id: string;
    sku: string | null;
    price: number;
    comparePrice: number | null;
    stock: number;
    isDefault: boolean;
    product: {
      id: string;
      type: string;
      translations: {
        id: string;
        name: string;
        locale: string;
      }[];
      image?: {
        id: string;
        url: string;
      } | null;
    };
  };
};

export type CartResponse = {
  id: string;
  items: CartItemResponse[];
  total: number;
};
