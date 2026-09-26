import Link from "next/link";
import { ProductSummary } from "@sneakerhead/types";
import { formatPrice } from "@/lib/api";

interface ProductCardProps {
  product: ProductSummary;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-slate-100">
        {product.primaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.primaryImage.url}
            alt={product.primaryImage.alt ?? product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="space-y-1 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          {product.category.name}
        </p>
        <h3 className="font-semibold text-slate-900">{product.name}</h3>
        <p className="text-sm text-slate-600">
          {formatPrice(product.minPriceCents)}
          {product.maxPriceCents != null &&
          product.minPriceCents != null &&
          product.maxPriceCents !== product.minPriceCents
            ? ` – ${formatPrice(product.maxPriceCents)}`
            : ""}
        </p>
      </div>
    </Link>
  );
}
