"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductVariantDto } from "@sneakerhead/types";

interface StockAdjusterProps {
  variants: ProductVariantDto[];
}

export function StockAdjuster({ variants }: StockAdjusterProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function adjust(variantId: string, delta: number) {
    setMessage(null);
    setError(null);
    const response = await fetch("/api/products/stock", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId, delta }),
    });
    const data = (await response.json()) as { message?: string; stock?: number };
    if (!response.ok) {
      setError(data.message ?? "Stock update failed");
      return;
    }
    setMessage(`Stock updated to ${data.stock}`);
    router.refresh();
  }

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <h3 className="font-semibold">Quick stock adjustments</h3>
      <div className="mt-4 space-y-3">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm"
          >
            <div>
              <p className="font-medium">
                {variant.sku} · {variant.size} / {variant.color}
              </p>
              <p className="text-slate-500">Current stock: {variant.stock}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => adjust(variant.id, -1)}
                className="rounded-lg border px-3 py-1"
              >
                −1
              </button>
              <button
                type="button"
                onClick={() => adjust(variant.id, 1)}
                className="rounded-lg border px-3 py-1"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => adjust(variant.id, 5)}
                className="rounded-lg border px-3 py-1"
              >
                +5
              </button>
            </div>
          </div>
        ))}
      </div>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
    </section>
  );
}
