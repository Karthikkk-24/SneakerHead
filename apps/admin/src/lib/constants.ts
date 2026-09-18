import { UserRole } from "@sneakerhead/types";

export const ACCESS_TOKEN_COOKIE = "admin_access_token";
export const REFRESH_TOKEN_COOKIE = "admin_refresh_token";
export const API_URL = process.env.API_URL ?? "http://localhost:3001";

export const ADMIN_ROLES: UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];
