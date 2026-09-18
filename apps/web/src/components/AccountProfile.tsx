"use client";

import { UserProfile } from "@sneakerhead/types";
import { FormEvent, useState } from "react";

interface AccountProfileProps {
  user: UserProfile;
}

export function AccountProfile({ user }: AccountProfileProps) {
  const [profile, setProfile] = useState(user);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as UserProfile & { message?: string };
      if (!response.ok) {
        throw new Error(data.message ?? "Update failed");
      }
      setProfile(data);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        throw new Error(data.message ?? "Password update failed");
      }
      setMessage(data.message ?? "Password updated.");
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password update failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="mt-1 text-slate-600">Manage your profile and security.</p>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100"
        >
          Log out
        </button>
      </div>

      {message && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Profile details</h2>
        <form onSubmit={handleProfileSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium">
            Name
            <input
              name="name"
              defaultValue={profile.name}
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium">
            Email
            <input
              name="email"
              type="email"
              defaultValue={profile.email}
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium md:col-span-2">
            Phone
            <input
              name="phone"
              defaultValue={profile.phone ?? ""}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-600 px-4 py-2 text-white md:col-span-2 md:w-fit"
          >
            Save profile
          </button>
        </form>
      </section>

      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Change password</h2>
        <form onSubmit={handlePasswordSubmit} className="mt-4 grid max-w-xl gap-4">
          <label className="block text-sm font-medium">
            Current password
            <input
              name="currentPassword"
              type="password"
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>
          <label className="block text-sm font-medium">
            New password
            <input
              name="newPassword"
              type="password"
              required
              minLength={8}
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-slate-900 px-4 py-2 text-white md:w-fit"
          >
            Update password
          </button>
        </form>
      </section>
    </div>
  );
}
