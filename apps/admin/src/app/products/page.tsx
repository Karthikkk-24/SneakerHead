import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductStatus } from "@sneakerhead/types";
import { AdminShell } from "@/components/AdminShell";
import { ProductsTable } from "@/components/ProductsTable";
import { listAdminProducts, listCategories } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";
import { getAdminSession } from "@/lib/session";

interface ProductsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    categoryId?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const user = await getAdminSession();
  if (!user) redirect("/login?redirect=/products");

  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login?redirect=/products");

  const params = await searchParams;
  const status = params.status ?? "";
  const [products, categories] = await Promise.all([
    listAdminProducts(accessToken, {
      page: Number(params.page ?? "1") || 1,
      search: params.search,
      status: Object.values(ProductStatus).includes(status as ProductStatus)
        ? status
        : undefined,
      categoryId: params.categoryId,
    }),
    listCategories(accessToken),
  ]);

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              {" / Products"}
            </p>
            <h2 className="text-2xl font-bold">Products</h2>
          </div>
          <Link
            href="/products/new"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
          >
            New product
          </Link>
        </div>

        <ProductsTable
          products={products.data}
          meta={products.meta}
          categories={categories}
          filters={{
            search: params.search ?? "",
            status,
            categoryId: params.categoryId ?? "",
          }}
        />
      </div>
    </AdminShell>
  );
}
