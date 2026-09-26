import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { CategoriesManager } from "@/components/CategoriesManager";
import { listCategories } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";
import { getAdminSession } from "@/lib/session";

export default async function CategoriesPage() {
  const user = await getAdminSession();
  if (!user) redirect("/login?redirect=/categories");

  const accessToken = await getAccessToken();
  if (!accessToken) redirect("/login?redirect=/categories");

  const categories = await listCategories(accessToken);

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            {" / Categories"}
          </p>
          <h2 className="text-2xl font-bold">Categories</h2>
        </div>
        <CategoriesManager initialCategories={categories} />
      </div>
    </AdminShell>
  );
}
