import { UserProfile } from "@sneakerhead/types";
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from "./auth-cookies";
import { getMe, refreshRequest } from "./api";

export async function getSession(): Promise<UserProfile | null> {
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
    return await getMe(accessToken);
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
      return await getMe(refreshed.tokens.accessToken);
    } catch {
      await clearAuthCookies();
      return null;
    }
  }
}
