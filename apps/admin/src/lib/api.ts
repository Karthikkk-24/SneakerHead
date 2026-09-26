import {
  AdminUpdateUserPayload,
  AuthResponse,
  PaginatedUsersResponse,
  UserProfile,
  UserRole,
  UserStatus,
} from "@sneakerhead/types";
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

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole | "";
  status?: UserStatus | "";
}

export async function listUsers(
  accessToken: string,
  params: ListUsersParams = {},
): Promise<PaginatedUsersResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.role) query.set("role", params.role);
  if (params.status) query.set("status", params.status);

  const qs = query.toString();
  return apiFetch<PaginatedUsersResponse>(
    `/admin/users${qs ? `?${qs}` : ""}`,
    { accessToken },
  );
}

export async function getUser(
  accessToken: string,
  userId: string,
): Promise<UserProfile> {
  return apiFetch<UserProfile>(`/admin/users/${userId}`, { accessToken });
}

export async function updateUser(
  accessToken: string,
  userId: string,
  payload: AdminUpdateUserPayload,
): Promise<UserProfile> {
  return apiFetch<UserProfile>(`/admin/users/${userId}`, {
    method: "PATCH",
    accessToken,
    body: JSON.stringify(payload),
  });
}

export async function forceLogoutUser(
  accessToken: string,
  userId: string,
): Promise<{ message: string; revokedSessions: number }> {
  return apiFetch(`/admin/users/${userId}/force-logout`, {
    method: "POST",
    accessToken,
  });
}
