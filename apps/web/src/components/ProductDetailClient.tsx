"use client";

import { useMemo, useState } from "react";
import { ProductDetail } from "@sneakerhead/types";
import { formatPrice } from "@/lib/api";

interface ProductDetailClientProps {
  product: ProductDetail;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const sizes = useMemo(
    () => [...new Set(product.variants.map((variant) => variant.size))],
    [product.variants],
  );
  const colors = useMemo(
    () => [...new Set(product.variants.map((variant) => variant.color))],
    [product.variants],
  );

  const [size, setSize] = useState(sizes[0] ?? "");
  const [color, setColor] = useState(colors[0] ?? "");

  const selected = product.variants.find(
    (variant) => variant.size === size && variant.color === color,
  );

  return (
    <div className="space-y-5 rounded-2xl border bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm font-medium">Size</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {sizes.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSize(value)}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                size === value
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "hover:border-slate-400"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">Color</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {colors.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setColor(value)}
              className={`rounded-lg border px-3 py-1.5 text-sm ${
                color === value
                  ? "border-brand-600 bg-brand-50 text-brand-700"
                  : "hover:border-slate-400"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {selected ? (
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-medium">SKU:</span> {selected.sku}
          </p>
          <p>
            <span className="font-medium">Price:</span>{" "}
            {formatPrice(selected.priceCents)}
            {selected.compareAtCents ? (
              <span className="ml-2 text-slate-400 line-through">
                {formatPrice(selected.compareAtCents)}
              </span>
            ) : null}
          </p>
          <p>
            <span className="font-medium">Stock:</span>{" "}
            {selected.stock > 0 ? `${selected.stock} available` : "Out of stock"}
          </p>
        </div>
      ) : (
        <p className="text-sm text-amber-700">
          This size/color combination is unavailable.
        </p>
      )}

      <button
        type="button"
        disabled={!selected || selected.stock <= 0}
        className="w-full rounded-lg bg-brand-600 px-4 py-3 font-medium text-white disabled:opacity-50"
      >
        {selected && selected.stock > 0
          ? "Add to cart (coming in Phase 4)"
          : "Unavailable"}
      </button>
    </div>
  );
}
