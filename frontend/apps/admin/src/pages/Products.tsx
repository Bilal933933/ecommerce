import { Layout } from "../components/Layout";
import { useAppStore } from "@workspace/store";
import { locales } from "@workspace/locales";
import { ProductCard } from "@/features/products/components/ProductCard"
import { ProductSkeleton } from "@/features/products/components/ProductSkeleton"
import { ProductsEmpty } from "@/features/products/components/ProductsEmpty"
import { mockProducts } from "@/features/products/data"
import { useState } from "react"
import type { Product } from "@workspace/types"

export function Products() {
  const { language } = useAppStore();
  const t = locales[language]?.app || {};
  const [isLoading] = useState(false);
  const [products] = useState(mockProducts);
  const [error] = useState<string | null>(null);

  const handleAddToCart = (product: Product) => {
    console.log("Added to cart:", product);
  };

  if (error) {
    return (
      <Layout className="p-4 sm:p-8">
        <div className="text-center p-4 rounded-lg bg-destructive/10 text-destructive">
          Failed to load products. Please try again later.
        </div>
      </Layout>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <Layout className="p-4 sm:p-8">
        <ProductsEmpty />
      </Layout>
    );
  }

  return (
    <Layout className="p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl space-y-8 px-4 sm:px-6">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t.productsTitle || "Our Products"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.productsDescription || "Explore our collection of amazing products"}
          </p>
        </header>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, idx) => <ProductSkeleton key={idx} />)
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  addToCartText={t.addToCart || "Add to Cart"}
                />
              ))}
        </section>
      </div>
    </Layout>
  );
}
