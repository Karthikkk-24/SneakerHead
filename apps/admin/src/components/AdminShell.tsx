import Link from "next/link";
import { UserProfile } from "@sneakerhead/types";
import { LogoutButton } from "./LogoutButton";

interface AdminShellProps {
  user: UserProfile;
  children: React.ReactNode;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
];

export function AdminShell({ user, children }: AdminShellProps) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="bg-sidebar text-white">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs uppercase tracking-widest text-slate-400">
            SneakerHead
          </p>
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between border-b bg-white px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Signed in as
            </p>
            <p className="font-medium">{user.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              {user.role}
            </span>
            <LogoutButton />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
