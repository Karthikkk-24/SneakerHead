export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedUsersResponse {
  data: UserProfile[];
  meta: PaginatedMeta;
}

export interface AdminUpdateUserPayload {
  role?: UserRole;
  status?: UserStatus;
  name?: string;
}
