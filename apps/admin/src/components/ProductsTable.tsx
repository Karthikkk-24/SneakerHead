"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  CategorySummary,
  ProductStatus,
  ProductSummary,
} from "@sneakerhead/types";

interface ProductsTableProps {
  products: ProductSummary[];
  meta: { page: number; limit: number; total: number; totalPages: number };
  categories: CategorySummary[];
  filters: { search: string; status: string; categoryId: string };
}

function formatPrice(cents: number | null) {
  if (cents == null) return "—";
  return `$${(cents / 100).toFixed(2)}`;
}

export function ProductsTable({
  products,
  meta,
  categories,
  filters,
}: ProductsTableProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  function handleFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const search = String(formData.get("search") ?? "").trim();
    const status = String(formData.get("status") ?? "");
    const categoryId = String(formData.get("categoryId") ?? "");
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (categoryId) params.set("categoryId", categoryId);
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  }

  async function bulkStatus(status: ProductStatus) {
    if (selected.length === 0) return;
    setError(null);
    const response = await fetch("/api/products/bulk-status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productIds: selected, status }),
    });
    const data = (await response.json()) as { message?: string };
    if (!response.ok) {
      setError(data.message ?? "Bulk update failed");
      return;
    }
    setSelected([]);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleFilter}
        className="grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-[1fr_160px_180px_auto]"
      >
        <input
          name="search"
          defaultValue={filters.search}
          placeholder="Search products or SKU"
          className="rounded-lg border px-3 py-2 text-sm"
        />
        <select
          name="status"
          defaultValue={filters.status}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {Object.values(ProductStatus).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          name="categoryId"
          defaultValue={filters.categoryId}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
        >
          Filter
        </button>
      </form>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 rounded-xl border bg-slate-50 px-4 py-3 text-sm">
          <span className="font-medium">{selected.length} selected</span>
          <button
            type="button"
            onClick={() => bulkStatus(ProductStatus.ACTIVE)}
            className="rounded-lg border bg-white px-3 py-1"
          >
            Publish
          </button>
          <button
            type="button"
            onClick={() => bulkStatus(ProductStatus.DRAFT)}
            className="rounded-lg border bg-white px-3 py-1"
          >
            Draft
          </button>
          <button
            type="button"
            onClick={() => bulkStatus(ProductStatus.ARCHIVED)}
            className="rounded-lg border bg-white px-3 py-1"
          >
            Archive
          </button>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={
                    products.length > 0 && selected.length === products.length
                  }
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? products.map((p) => p.id) : [],
                    );
                  }}
                />
              </th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(product.id)}
                    onChange={(event) => {
                      setSelected((current) =>
                        event.target.checked
                          ? [...current, product.id]
                          : current.filter((id) => id !== product.id),
                      );
                    }}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.primaryImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.primaryImage.url}
                        alt={product.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-slate-100" />
                    )}
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{product.category.name}</td>
                <td className="px-4 py-3">{formatPrice(product.minPriceCents)}</td>
                <td className="px-4 py-3">{product.totalStock}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium">
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/products/${product.id}`}
                    className="font-medium underline-offset-2 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-slate-600">
        Page {meta.page} of {meta.totalPages} ({meta.total} products)
      </p>
    </div>
  );
}
