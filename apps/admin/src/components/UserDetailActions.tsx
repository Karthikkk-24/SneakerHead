"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { UserProfile, UserRole, UserStatus } from "@sneakerhead/types";

interface UserDetailActionsProps {
  user: UserProfile;
  actorRole: UserRole;
  isSelf: boolean;
}

export function UserDetailActions({
  user,
  actorRole,
  isSelf,
}: UserDetailActionsProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canChangeRole = actorRole === UserRole.SUPER_ADMIN && !isSelf;
  const canChangeStatus = !isSelf;

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const payload: Record<string, string> = {};
      if (name.trim() !== user.name) payload.name = name.trim();
      if (canChangeRole && role !== user.role) payload.role = role;
      if (canChangeStatus && status !== user.status) payload.status = status;

      if (Object.keys(payload).length === 0) {
        setMessage("No changes to save");
        return;
      }

      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message ?? "Update failed");
      }

      setMessage("User updated");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleForceLogout() {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "force-logout" }),
      });
      const data = (await response.json()) as {
        message?: string;
        revokedSessions?: number;
      };

      if (!response.ok) {
        throw new Error(data.message ?? "Force logout failed");
      }

      setMessage(
        `Sessions revoked (${data.revokedSessions ?? 0} active token(s))`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Force logout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <label className="block text-sm font-medium">
        Name
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 w-full rounded-lg border px-3 py-2"
          minLength={2}
          required
        />
      </label>

      <label className="block text-sm font-medium">
        Role
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as UserRole)}
          disabled={!canChangeRole}
          className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-slate-50"
        >
          {Object.values(UserRole).map((value) => (
            <option key={String(value)} value={String(value)}>
              {String(value)}
            </option>
          ))}
        </select>
        {!canChangeRole && (
          <p className="mt-1 text-xs text-slate-500">
            {isSelf
              ? "You cannot change your own role."
              : "Only super admins can change roles."}
          </p>
        )}
      </label>

      <label className="block text-sm font-medium">
        Status
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as UserStatus)}
          disabled={!canChangeStatus}
          className="mt-1 w-full rounded-lg border px-3 py-2 disabled:bg-slate-50"
        >
          {Object.values(UserStatus).map((value) => (
            <option key={String(value)} value={String(value)}>
              {String(value)}
            </option>
          ))}
        </select>
        {isSelf && (
          <p className="mt-1 text-xs text-slate-500">
            You cannot change your own status.
          </p>
        )}
      </label>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm text-white disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save changes"}
        </button>
        {!isSelf && (
          <button
            type="button"
            disabled={loading}
            onClick={handleForceLogout}
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 disabled:opacity-60"
          >
            Force logout
          </button>
        )}
      </div>
    </form>
  );
}
