import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { ProductForm } from "@/components/ProductForm";
import { listCategories } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";
import { getAdminSession } from "@/lib/session";

export default async function NewProductPage() {
  const user = await getAdminSession();
  if (!user) redirect("/login?redirect=/products/new");
  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login?redirect=/products/new");

  const categories = await listCategories(accessToken);
  if (categories.length === 0) {
    return (
      <AdminShell user={user}>
        <p className="rounded-xl border bg-amber-50 p-4 text-sm text-amber-800">
          Create a category before adding products.{" "}
          <Link href="/categories" className="underline">
            Go to categories
          </Link>
        </p>
      </AdminShell>
    );
  }

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">
            <Link href="/products" className="hover:underline">
              Products
            </Link>
            {" / New"}
          </p>
          <h2 className="text-2xl font-bold">New product</h2>
        </div>
        <ProductForm categories={categories} />
      </div>
    </AdminShell>
  );
}
