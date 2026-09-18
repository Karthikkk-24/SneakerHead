"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Reset failed");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Password updated</h1>
        <p className="mt-2 text-slate-600">
          You can now sign in with your new password.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-lg bg-brand-600 px-4 py-2 text-white"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold">Reset password</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          New password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !token}
          className="w-full rounded-lg bg-brand-600 px-4 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}
