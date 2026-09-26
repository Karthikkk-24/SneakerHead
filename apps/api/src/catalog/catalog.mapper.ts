import {
  CategorySummary,
  ProductDetail,
  ProductImageDto,
  ProductStatus,
  ProductSummary,
  ProductVariantDto,
} from "@sneakerhead/types";
import {
  Category,
  Product,
  ProductImage,
  ProductVariant,
} from "@prisma/client";

type ProductWithRelations = Product & {
  category: Pick<Category, "id" | "name" | "slug">;
  images: ProductImage[];
  variants: ProductVariant[];
};

export function toCategorySummary(
  category: Category & { _count?: { products: number } },
): CategorySummary {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    parentId: category.parentId,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
    productCount: category._count?.products,
  };
}

export function toImageDto(image: ProductImage): ProductImageDto {
  return {
    id: image.id,
    url: image.url,
    alt: image.alt,
    sortOrder: image.sortOrder,
    isPrimary: image.isPrimary,
  };
}

export function toVariantDto(variant: ProductVariant): ProductVariantDto {
  return {
    id: variant.id,
    sku: variant.sku,
    size: variant.size,
    color: variant.color,
    priceCents: variant.priceCents,
    compareAtCents: variant.compareAtCents,
    stock: variant.stock,
  };
}

export function toProductSummary(product: ProductWithRelations): ProductSummary {
  const prices = product.variants.map((v) => v.priceCents);
  const primary =
    product.images.find((img) => img.isPrimary) ?? product.images[0] ?? null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    status: product.status as ProductStatus,
    featured: product.featured,
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    primaryImage: primary ? toImageDto(primary) : null,
    minPriceCents: prices.length ? Math.min(...prices) : null,
    maxPriceCents: prices.length ? Math.max(...prices) : null,
    totalStock: product.variants.reduce((sum, v) => sum + v.stock, 0),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function toProductDetail(product: ProductWithRelations): ProductDetail {
  return {
    ...toProductSummary(product),
    images: [...product.images]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(toImageDto),
    variants: product.variants.map(toVariantDto),
  };
}
