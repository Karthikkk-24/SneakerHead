import Link from "next/link";
import { getSession } from "@/lib/session";

export async function Navbar() {
  const user = await getSession();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-brand-600">
          SneakerHead
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="text-slate-600 hover:text-slate-900">
            Home
          </Link>
          {user ? (
            <>
              <Link
                href="/account"
                className="text-slate-600 hover:text-slate-900"
              >
                My Account
              </Link>
              <span className="text-slate-400">|</span>
              <span className="text-slate-700">{user.name}</span>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-600 hover:text-slate-900">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
