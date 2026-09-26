"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { UserProfile, UserRole, UserStatus } from "@sneakerhead/types";

interface UsersTableProps {
  users: UserProfile[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    search: string;
    role: string;
    status: string;
  };
}

export function UsersTable({ users, meta, filters }: UsersTableProps) {
  const router = useRouter();

  function handleFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const search = String(formData.get("search") ?? "").trim();
    const role = String(formData.get("role") ?? "");
    const status = String(formData.get("status") ?? "");

    if (search) params.set("search", search);
    if (role) params.set("role", role);
    if (status) params.set("status", status);
    params.set("page", "1");

    router.push(`/users?${params.toString()}`);
  }

  function goToPage(page: number) {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.role) params.set("role", filters.role);
    if (filters.status) params.set("status", filters.status);
    params.set("page", String(page));
    router.push(`/users?${params.toString()}`);
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleFilter}
        className="grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-[1fr_160px_160px_auto]"
      >
        <input
          name="search"
          defaultValue={filters.search}
          placeholder="Search name or email"
          className="rounded-lg border px-3 py-2 text-sm"
        />
        <select
          name="role"
          defaultValue={filters.role}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">All roles</option>
          {Object.values(UserRole).map((role) => (
            <option key={String(role)} value={String(role)}>
              {String(role)}
            </option>
          ))}
        </select>
        <select
          name="status"
          defaultValue={filters.status}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {Object.values(UserStatus).map((status) => (
            <option key={String(status)} value={String(status)}>
              {String(status)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
        >
          Filter
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/users/${user.id}`}
                      className="font-medium text-slate-900 underline-offset-2 hover:underline"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <p>
          Showing page {meta.page} of {meta.totalPages} ({meta.total} users)
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={meta.page <= 1}
            onClick={() => goToPage(meta.page - 1)}
            className="rounded-lg border px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={meta.page >= meta.totalPages}
            onClick={() => goToPage(meta.page + 1)}
            className="rounded-lg border px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  const styles: Record<UserStatus, string> = {
    [UserStatus.ACTIVE]: "bg-emerald-50 text-emerald-700",
    [UserStatus.DISABLED]: "bg-red-50 text-red-700",
    [UserStatus.PENDING_VERIFICATION]: "bg-amber-50 text-amber-700",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}
