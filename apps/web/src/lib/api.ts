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

export type LoginPayload = { email: string; password: string };
export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
  phone?: string;
};

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerRequest(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
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

export async function getMe(accessToken: string): Promise<UserProfile> {
  return apiFetch<UserProfile>("/users/me", { accessToken });
}

export async function updateProfile(
  accessToken: string,
  payload: { name?: string; email?: string; phone?: string },
): Promise<UserProfile> {
  return apiFetch<UserProfile>("/users/me", {
    method: "PATCH",
    accessToken,
    body: JSON.stringify(payload),
  });
}

export async function changePassword(
  accessToken: string,
  payload: { currentPassword: string; newPassword: string },
): Promise<{ message: string }> {
  return apiFetch("/users/me/password", {
    method: "PATCH",
    accessToken,
    body: JSON.stringify(payload),
  });
}

export async function forgotPasswordRequest(email: string) {
  return apiFetch<{ message: string; resetToken?: string }>(
    "/auth/forgot-password",
    {
      method: "POST",
      body: JSON.stringify({ email }),
    },
  );
}

export async function resetPasswordRequest(
  token: string,
  password: string,
) {
  return apiFetch<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}
