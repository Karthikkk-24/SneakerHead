import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRole, UserStatus } from "@sneakerhead/types";
import { AdminShell } from "@/components/AdminShell";
import { UsersTable } from "@/components/UsersTable";
import { listUsers } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";
import { getAdminSession } from "@/lib/session";

interface UsersPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    role?: string;
    status?: string;
  }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const user = await getAdminSession();
  if (!user) {
    redirect("/login?redirect=/users");
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/login?redirect=/users");
  }

  const params = await searchParams;
  const roleParam = params.role ?? "";
  const statusParam = params.status ?? "";

  const result = await listUsers(accessToken, {
    page: Number(params.page ?? "1") || 1,
    limit: 20,
    search: params.search,
    role: Object.values(UserRole).includes(roleParam as UserRole)
      ? (roleParam as UserRole)
      : "",
    status: Object.values(UserStatus).includes(statusParam as UserStatus)
      ? (statusParam as UserStatus)
      : "",
  });

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              {" / Users"}
            </p>
            <h2 className="text-2xl font-bold">Users</h2>
            <p className="mt-1 text-sm text-slate-600">
              Search, filter, and manage customer and admin accounts.
            </p>
          </div>
        </div>

        <UsersTable
          users={result.data}
          meta={result.meta}
          filters={{
            search: params.search ?? "",
            role: roleParam,
            status: statusParam,
          }}
        />
      </div>
    </AdminShell>
  );
}
