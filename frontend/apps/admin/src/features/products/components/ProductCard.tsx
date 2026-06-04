import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/index";
import { cn } from "@workspace/ui/lib/utils";
import type { Product } from "@workspace/types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  addToCartText?: string;
}

export function ProductCard({ product, onAddToCart, addToCartText = "Add to Cart" }: ProductCardProps) {
  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300",
        "hover:shadow-lg hover:shadow-primary/5",
        "dark:hover:shadow-primary/10"
      )}
    >
      <div
        className={cn(
          "aspect-video bg-muted/50 flex items-center justify-center",
          "text-muted-foreground/30 transition-transform duration-300 group-hover:scale-105",
          "rounded-t-lg"
        )}
      >
        {product.image ? (
          <img src={product.image} alt={product.name} className="size-full object-cover" />
        ) : (
          <svg className="size-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}
      </div>

      <CardHeader>
        <CardTitle className="text-xl text-foreground line-clamp-1">{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-primary">{product.price}</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => onAddToCart?.(product)}
          className={cn("w-full rounded-full transition-all", "active:scale-95")}
        >
          {addToCartText}
        </Button>
      </CardFooter>
    </Card>
  );
}
