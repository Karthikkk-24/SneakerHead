import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { ProductForm } from "@/components/ProductForm";
import { StockAdjuster } from "@/components/StockAdjuster";
import { getAdminProduct, listCategories } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";
import { getAdminSession } from "@/lib/session";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const user = await getAdminSession();
  if (!user) redirect("/login?redirect=/products");
  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login?redirect=/products");

  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProduct(accessToken, id),
    listCategories(accessToken),
  ]);

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">
            <Link href="/products" className="hover:underline">
              Products
            </Link>
            {" / Edit"}
          </p>
          <h2 className="text-2xl font-bold">{product.name}</h2>
        </div>
        <ProductForm categories={categories} product={product} />
        <StockAdjuster variants={product.variants} />
      </div>
    </AdminShell>
  );
}
