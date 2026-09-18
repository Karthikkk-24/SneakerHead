import { UserProfile } from "@sneakerhead/types";
import { ADMIN_ROLES } from "./constants";
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from "./auth-cookies";
import { getAdminProfile, refreshRequest } from "./api";

export async function getAdminSession(): Promise<UserProfile | null> {
  let accessToken = await getAccessToken();
  let refreshToken = await getRefreshToken();

  if (!accessToken && refreshToken) {
    try {
      const refreshed = await refreshRequest(refreshToken);
      await setAuthCookies(
        refreshed.tokens.accessToken,
        refreshed.tokens.refreshToken,
      );
      accessToken = refreshed.tokens.accessToken;
      refreshToken = refreshed.tokens.refreshToken;
    } catch {
      await clearAuthCookies();
      return null;
    }
  }

  if (!accessToken) {
    return null;
  }

  try {
    const user = await getAdminProfile(accessToken);
    if (!ADMIN_ROLES.includes(user.role)) {
      await clearAuthCookies();
      return null;
    }
    return user;
  } catch {
    if (!refreshToken) {
      await clearAuthCookies();
      return null;
    }

    try {
      const refreshed = await refreshRequest(refreshToken);
      await setAuthCookies(
        refreshed.tokens.accessToken,
        refreshed.tokens.refreshToken,
      );
      const user = await getAdminProfile(refreshed.tokens.accessToken);
      if (!ADMIN_ROLES.includes(user.role)) {
        await clearAuthCookies();
        return null;
      }
      return user;
    } catch {
      await clearAuthCookies();
      return null;
    }
  }
}
