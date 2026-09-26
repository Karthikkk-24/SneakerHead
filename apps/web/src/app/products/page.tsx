import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductCard } from "@/components/ProductCard";
import { listCatalogCategories, listCatalogProducts } from "@/lib/api";

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const [categories, products] = await Promise.all([
    listCatalogCategories(),
    listCatalogProducts({
      page: Number(params.page ?? "1") || 1,
      limit: 12,
      search: params.search,
      categorySlug: params.category,
      minPriceCents:
        minPrice !== undefined && !Number.isNaN(minPrice)
          ? Math.round(minPrice * 100)
          : undefined,
      maxPriceCents:
        maxPrice !== undefined && !Number.isNaN(maxPrice)
          ? Math.round(maxPrice * 100)
          : undefined,
      sort: params.sort,
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold">Shop</h1>
        <p className="mt-1 text-slate-600">
          {products.meta.total} products available
        </p>
      </div>

      <CatalogFilters
        categories={categories}
        filters={{
          search: params.search ?? "",
          categorySlug: params.category ?? "",
          minPrice: params.minPrice ?? "",
          maxPrice: params.maxPrice ?? "",
          sort: params.sort ?? "newest",
        }}
      />

      {products.data.length === 0 ? (
        <p className="rounded-2xl border bg-white p-8 text-center text-slate-500">
          No products match your filters.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
