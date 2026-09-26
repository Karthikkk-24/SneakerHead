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

export enum ProductStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
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

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productCount?: number;
}

export interface ProductImageDto {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductVariantDto {
  id: string;
  sku: string;
  size: string;
  color: string;
  priceCents: number;
  compareAtCents: number | null;
  stock: number;
}

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: ProductStatus;
  featured: boolean;
  category: { id: string; name: string; slug: string };
  primaryImage: ProductImageDto | null;
  minPriceCents: number | null;
  maxPriceCents: number | null;
  totalStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetail extends ProductSummary {
  images: ProductImageDto[];
  variants: ProductVariantDto[];
}

export interface PaginatedProductsResponse {
  data: ProductSummary[];
  meta: PaginatedMeta;
}

export interface CreateCategoryPayload {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
  description?: string | null;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

export interface VariantInput {
  sku: string;
  size: string;
  color: string;
  priceCents: number;
  compareAtCents?: number | null;
  stock?: number;
}

export interface ImageInput {
  url: string;
  alt?: string | null;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface CreateProductPayload {
  name: string;
  slug?: string;
  description: string;
  categoryId: string;
  status?: ProductStatus;
  featured?: boolean;
  variants: VariantInput[];
  images?: ImageInput[];
}

export interface UpdateProductPayload {
  name?: string;
  slug?: string;
  description?: string;
  categoryId?: string;
  status?: ProductStatus;
  featured?: boolean;
  variants?: VariantInput[];
  images?: ImageInput[];
}

export interface BulkProductStatusPayload {
  productIds: string[];
  status: ProductStatus;
}

export interface AdjustStockPayload {
  variantId: string;
  delta: number;
}
