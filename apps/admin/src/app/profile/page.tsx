import { redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { getAdminSession } from "@/lib/session";

export default async function AdminProfilePage() {
  const user = await getAdminSession();
  if (!user) {
    redirect("/login?redirect=/profile");
  }

  return (
    <AdminShell user={user}>
      <div className="max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">Admin profile</h2>
        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="text-slate-500">Name</dt>
            <dd className="font-medium">{user.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Role</dt>
            <dd className="font-medium">{user.role}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Status</dt>
            <dd className="font-medium">{user.status}</dd>
          </div>
        </dl>
      </div>
    </AdminShell>
  );
}
