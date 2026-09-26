"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CategorySummary } from "@sneakerhead/types";

interface CategoriesManagerProps {
  initialCategories: CategorySummary[];
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: description || undefined }),
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(data.message ?? "Failed to create");
      setName("");
      setDescription("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(category: CategorySummary) {
    setError(null);
    const response = await fetch(`/api/categories/${category.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !category.isActive }),
    });
    const data = (await response.json()) as { message?: string };
    if (!response.ok) {
      setError(data.message ?? "Failed to update");
      return;
    }
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this category?")) return;
    setError(null);
    const response = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const data = (await response.json()) as { message?: string };
    if (!response.ok) {
      setError(data.message ?? "Failed to delete");
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleCreate}
        className="grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_auto]"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          required
          minLength={2}
          className="rounded-lg border px-3 py-2 text-sm"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="rounded-lg border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-60"
        >
          {loading ? "Saving..." : "Add category"}
        </button>
      </form>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {initialCategories.map((category) => (
              <tr key={category.id}>
                <td className="px-4 py-3 font-medium">{category.name}</td>
                <td className="px-4 py-3 text-slate-600">{category.slug}</td>
                <td className="px-4 py-3">{category.productCount ?? 0}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleActive(category)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      category.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(category.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
