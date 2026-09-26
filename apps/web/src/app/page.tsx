import Link from "next/link";
import {
  formatPrice,
  listCatalogCategories,
  listCatalogProducts,
} from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    listCatalogProducts({ featured: true, limit: 6 }),
    listCatalogCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-10">
      <section className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 px-8 py-16 text-white">
        <p className="text-sm uppercase tracking-widest text-brand-100">
          SneakerHead
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight">
          Find your next pair.
        </h1>
        <p className="mt-4 max-w-xl text-brand-100">
          Browse lifestyle, running, and basketball sneakers. Catalog is live —
          checkout arrives next.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/products"
            className="rounded-lg bg-white px-5 py-3 font-medium text-brand-700 hover:bg-brand-50"
          >
            Shop all
          </Link>
          <Link
            href="/register"
            className="rounded-lg border border-white/30 px-5 py-3 font-medium hover:bg-white/10"
          >
            Create account
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">Shop by category</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="rounded-2xl border bg-white p-5 shadow-sm transition hover:border-brand-300"
            >
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <p className="mt-1 text-sm text-slate-600">
                {category.description ?? "Explore the collection"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">Featured</h2>
          <Link href="/products" className="text-sm font-medium text-brand-700">
            View all
          </Link>
        </div>
        {featured.data.length === 0 ? (
          <p className="text-slate-500">No featured products yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        <p className="text-xs text-slate-400">
          From {formatPrice(featured.data[0]?.minPriceCents)}
        </p>
      </section>
    </div>
  );
}
