import { AuthResponse, UserProfile } from "@sneakerhead/types";
import { API_URL } from "./constants";

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { accessToken?: string } = {},
): Promise<T> {
  const { accessToken, headers, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
  });

  const data = (await response.json()) as T & { message?: string | string[] };

  if (!response.ok) {
    const message = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message ?? "Request failed";
    throw new Error(message);
  }

  return data;
}

export async function loginRequest(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function refreshRequest(refreshToken: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function logoutRequest(refreshToken: string): Promise<void> {
  await apiFetch("/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function getAdminProfile(accessToken: string): Promise<UserProfile> {
  return apiFetch<UserProfile>("/admin/profile", { accessToken });
}

export interface AdminDashboard {
  admin: UserProfile;
  stats: {
    customers: number;
    orders: number;
    revenue: number;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    createdAt: string;
    user: { name: string; email: string } | null;
  }>;
}

export async function getDashboard(accessToken: string): Promise<AdminDashboard> {
  return apiFetch<AdminDashboard>("/admin/dashboard", { accessToken });
}
