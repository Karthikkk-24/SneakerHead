"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CategorySummary } from "@sneakerhead/types";

interface CatalogFiltersProps {
  categories: CategorySummary[];
  filters: {
    search: string;
    categorySlug: string;
    minPrice: string;
    maxPrice: string;
    sort: string;
  };
}

export function CatalogFilters({ categories, filters }: CatalogFiltersProps) {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const search = String(formData.get("search") ?? "").trim();
    const categorySlug = String(formData.get("categorySlug") ?? "");
    const minPrice = String(formData.get("minPrice") ?? "").trim();
    const maxPrice = String(formData.get("maxPrice") ?? "").trim();
    const sort = String(formData.get("sort") ?? "");

    if (search) params.set("search", search);
    if (categorySlug) params.set("category", categorySlug);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort) params.set("sort", sort);

    router.push(`/products?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-[1.2fr_1fr_0.7fr_0.7fr_1fr_auto]"
    >
      <input
        name="search"
        defaultValue={filters.search}
        placeholder="Search sneakers"
        className="rounded-lg border px-3 py-2 text-sm"
      />
      <select
        name="categorySlug"
        defaultValue={filters.categorySlug}
        className="rounded-lg border px-3 py-2 text-sm"
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        name="minPrice"
        type="number"
        min="0"
        step="1"
        defaultValue={filters.minPrice}
        placeholder="Min $"
        className="rounded-lg border px-3 py-2 text-sm"
      />
      <input
        name="maxPrice"
        type="number"
        min="0"
        step="1"
        defaultValue={filters.maxPrice}
        placeholder="Max $"
        className="rounded-lg border px-3 py-2 text-sm"
      />
      <select
        name="sort"
        defaultValue={filters.sort}
        className="rounded-lg border px-3 py-2 text-sm"
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="name">Name</option>
      </select>
      <button
        type="submit"
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white"
      >
        Apply
      </button>
    </form>
  );
}
