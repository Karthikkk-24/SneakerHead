import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <section className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 px-8 py-16 text-white">
        <p className="text-sm uppercase tracking-widest text-brand-100">
          Phase 1 Complete
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight">
          SneakerHead customer experience is ready for authentication.
        </h1>
        <p className="mt-4 max-w-xl text-brand-100">
          Register, sign in, and manage your profile. Product catalog and
          checkout arrive in the next phases.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/register"
            className="rounded-lg bg-white px-5 py-3 font-medium text-brand-700 hover:bg-brand-50"
          >
            Get started
          </Link>
          <Link
            href="/account"
            className="rounded-lg border border-white/30 px-5 py-3 font-medium hover:bg-white/10"
          >
            My account
          </Link>
        </div>
      </section>
    </div>
  );
}
