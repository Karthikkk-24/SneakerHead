import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { formatPrice, getCatalogProduct } from "@/lib/api";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  try {
    const { slug } = await params;
    const product = await getCatalogProduct(slug);
    return {
      title: `${product.name} | SneakerHead`,
      description: product.description.slice(0, 160),
      openGraph: {
        title: product.name,
        description: product.description.slice(0, 160),
        images: product.primaryImage ? [product.primaryImage.url] : [],
      },
    };
  } catch {
    return { title: "Product | SneakerHead" };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let product;
  try {
    product = await getCatalogProduct(slug);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm text-slate-500">
        <Link href="/products" className="hover:underline">
          Shop
        </Link>
        {" / "}
        <Link
          href={`/categories/${product.category.slug}`}
          className="hover:underline"
        >
          {product.category.name}
        </Link>
        {" / "}
        {product.name}
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border bg-slate-100">
          {product.primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.primaryImage.url}
              alt={product.primaryImage.alt ?? product.name}
              className="aspect-square w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center text-slate-400">
              No image
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">
              {product.category.name}
            </p>
            <h1 className="mt-1 text-3xl font-bold">{product.name}</h1>
            <p className="mt-3 text-xl font-semibold text-brand-700">
              {formatPrice(product.minPriceCents)}
              {product.maxPriceCents != null &&
              product.minPriceCents != null &&
              product.maxPriceCents !== product.minPriceCents
                ? ` – ${formatPrice(product.maxPriceCents)}`
                : ""}
            </p>
          </div>

          <p className="leading-relaxed text-slate-600">{product.description}</p>

          <ProductDetailClient product={product} />
        </div>
      </div>
    </div>
  );
}
