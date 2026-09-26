import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { getCatalogCategory, listCatalogProducts } from "@/lib/api";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  let category;
  try {
    category = await getCatalogCategory(slug);
  } catch {
    notFound();
  }

  const products = await listCatalogProducts({
    categorySlug: slug,
    limit: 24,
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div>
        <p className="text-sm text-slate-500">
          <Link href="/products" className="hover:underline">
            Shop
          </Link>
          {" / "}
          {category.name}
        </p>
        <h1 className="mt-2 text-3xl font-bold">{category.name}</h1>
        {category.description ? (
          <p className="mt-2 text-slate-600">{category.description}</p>
        ) : null}
      </div>

      {products.data.length === 0 ? (
        <p className="text-slate-500">No products in this category yet.</p>
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
