import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { UserDetailActions } from "@/components/UserDetailActions";
import { getUser } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";
import { getAdminSession } from "@/lib/session";

interface UserDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const admin = await getAdminSession();
  if (!admin) {
    redirect("/login?redirect=/users");
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/login?redirect=/users");
  }

  const { id } = await params;
  const user = await getUser(accessToken, id);

  return (
    <AdminShell user={admin}>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <p className="text-sm text-slate-500">
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            {" / "}
            <Link href="/users" className="hover:underline">
              Users
            </Link>
            {" / Detail"}
          </p>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="mt-1 text-sm text-slate-600">{user.email}</p>
        </div>

        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <dl className="mb-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">User ID</dt>
              <dd className="break-all font-mono text-xs">{user.id}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Email verified</dt>
              <dd className="font-medium">{user.emailVerified ? "Yes" : "No"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Created</dt>
              <dd className="font-medium">
                {new Date(user.createdAt).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Updated</dt>
              <dd className="font-medium">
                {new Date(user.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>

          <UserDetailActions
            user={user}
            actorRole={admin.role}
            isSelf={admin.id === user.id}
          />
        </div>
      </div>
    </AdminShell>
  );
}
