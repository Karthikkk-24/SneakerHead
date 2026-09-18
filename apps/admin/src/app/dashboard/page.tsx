import { redirect } from "next/navigation";
import { AdminShell } from "@/components/AdminShell";
import { getDashboard } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";
import { getAdminSession } from "@/lib/session";

export default async function DashboardPage() {
  const user = await getAdminSession();
  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    redirect("/login?redirect=/dashboard");
  }

  const dashboard = await getDashboard(accessToken);

  return (
    <AdminShell user={user}>
      <div className="space-y-6">
        <div>
          <p className="text-sm text-slate-500">Overview</p>
          <h2 className="text-2xl font-bold">Dashboard</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Customers", value: dashboard.stats.customers },
            { label: "Orders", value: dashboard.stats.orders },
            { label: "Revenue", value: `$${dashboard.stats.revenue}` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Recent admin activity</h3>
          {dashboard.recentActivity.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">
              No admin activity logged yet.
            </p>
          ) : (
            <ul className="mt-4 divide-y">
              {dashboard.recentActivity.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium">{item.action}</p>
                    <p className="text-slate-500">
                      {item.user?.name ?? "Unknown"} · {item.user?.email ?? "—"}
                    </p>
                  </div>
                  <time className="text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
