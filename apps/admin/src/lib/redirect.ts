export function getSafeRedirectPath(
  value: string | null,
  fallback = "/dashboard",
): string {
  if (!value) {
    return fallback;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}
