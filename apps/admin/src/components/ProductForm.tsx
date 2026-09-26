"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CategorySummary,
  ProductDetail,
  ProductStatus,
} from "@sneakerhead/types";

interface VariantDraft {
  sku: string;
  size: string;
  color: string;
  priceCents: string;
  compareAtCents: string;
  stock: string;
}

interface ImageDraft {
  url: string;
  alt: string;
  isPrimary: boolean;
}

interface ProductFormProps {
  categories: CategorySummary[];
  product?: ProductDetail;
}

function emptyVariant(): VariantDraft {
  return {
    sku: "",
    size: "",
    color: "",
    priceCents: "",
    compareAtCents: "",
    stock: "0",
  };
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [categoryId, setCategoryId] = useState(
    product?.category.id ?? categories[0]?.id ?? "",
  );
  const [status, setStatus] = useState<ProductStatus>(
    product?.status ?? ProductStatus.DRAFT,
  );
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [variants, setVariants] = useState<VariantDraft[]>(
    product?.variants.map((variant) => ({
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      priceCents: String(variant.priceCents),
      compareAtCents:
        variant.compareAtCents != null ? String(variant.compareAtCents) : "",
      stock: String(variant.stock),
    })) ?? [emptyVariant()],
  );
  const [images, setImages] = useState<ImageDraft[]>(
    product?.images.map((image) => ({
      url: image.url,
      alt: image.alt ?? "",
      isPrimary: image.isPrimary,
    })) ?? [{ url: "", alt: "", isPrimary: true }],
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name,
      slug: slug || undefined,
      description,
      categoryId,
      status,
      featured,
      variants: variants.map((variant) => ({
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        priceCents: Number(variant.priceCents),
        compareAtCents: variant.compareAtCents
          ? Number(variant.compareAtCents)
          : null,
        stock: Number(variant.stock || 0),
      })),
      images: images
        .filter((image) => image.url.trim())
        .map((image, index) => ({
          url: image.url.trim(),
          alt: image.alt || null,
          sortOrder: index,
          isPrimary: image.isPrimary,
        })),
    };

    try {
      const response = await fetch(
        isEdit ? `/api/products/${product.id}` : "/api/products",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await response.json()) as { message?: string; id?: string };
      if (!response.ok) throw new Error(data.message ?? "Save failed");
      router.push("/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 rounded-2xl border bg-white p-6 shadow-sm md:grid-cols-2">
        <label className="block text-sm font-medium md:col-span-2">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium">
          Slug
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated if empty"
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium">
          Category
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border px-3 py-2"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium md:col-span-2">
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={10}
            rows={4}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProductStatus)}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          >
            {Object.values(ProductStatus).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Featured on homepage
        </label>
      </div>

      <section className="space-y-3 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Variants</h3>
          <button
            type="button"
            onClick={() => setVariants((current) => [...current, emptyVariant()])}
            className="text-sm font-medium text-slate-700 underline"
          >
            Add variant
          </button>
        </div>
        {variants.map((variant, index) => (
          <div
            key={index}
            className="grid gap-2 rounded-xl border p-3 md:grid-cols-6"
          >
            {(
              [
                ["sku", "SKU"],
                ["size", "Size"],
                ["color", "Color"],
                ["priceCents", "Price (cents)"],
                ["compareAtCents", "Compare (cents)"],
                ["stock", "Stock"],
              ] as const
            ).map(([field, label]) => (
              <label key={field} className="block text-xs font-medium">
                {label}
                <input
                  value={variant[field]}
                  onChange={(e) => {
                    const value = e.target.value;
                    setVariants((current) =>
                      current.map((item, i) =>
                        i === index ? { ...item, [field]: value } : item,
                      ),
                    );
                  }}
                  required={field !== "compareAtCents"}
                  className="mt-1 w-full rounded-lg border px-2 py-1.5 text-sm"
                />
              </label>
            ))}
          </div>
        ))}
      </section>

      <section className="space-y-3 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Images</h3>
          <button
            type="button"
            onClick={() =>
              setImages((current) => [
                ...current,
                { url: "", alt: "", isPrimary: false },
              ])
            }
            className="text-sm font-medium text-slate-700 underline"
          >
            Add image URL
          </button>
        </div>
        {images.map((image, index) => (
          <div key={index} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
            <input
              value={image.url}
              onChange={(e) =>
                setImages((current) =>
                  current.map((item, i) =>
                    i === index ? { ...item, url: e.target.value } : item,
                  ),
                )
              }
              placeholder="https://..."
              className="rounded-lg border px-3 py-2 text-sm"
            />
            <input
              value={image.alt}
              onChange={(e) =>
                setImages((current) =>
                  current.map((item, i) =>
                    i === index ? { ...item, alt: e.target.value } : item,
                  ),
                )
              }
              placeholder="Alt text"
              className="rounded-lg border px-3 py-2 text-sm"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="primaryImage"
                checked={image.isPrimary}
                onChange={() =>
                  setImages((current) =>
                    current.map((item, i) => ({
                      ...item,
                      isPrimary: i === index,
                    })),
                  )
                }
              />
              Primary
            </label>
          </div>
        ))}
      </section>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-slate-900 px-5 py-2.5 text-white disabled:opacity-60"
      >
        {loading ? "Saving..." : isEdit ? "Update product" : "Create product"}
      </button>
    </form>
  );
}
