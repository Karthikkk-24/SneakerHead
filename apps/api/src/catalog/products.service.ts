import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, ProductStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import {
  AdjustStockDto,
  BulkStatusDto,
  CreateProductDto,
  ListProductsQueryDto,
  UpdateProductDto,
} from "./dto/product.dto";
import { SlugService } from "./slug.service";

const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
  images: true,
  variants: true,
} satisfies Prisma.ProductInclude;

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly slugService: SlugService,
  ) {}

  async list(query: ListProductsQueryDto, options: { publicOnly?: boolean } = {}) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (options.publicOnly) {
      where.status = ProductStatus.ACTIVE;
    } else if (query.status) {
      where.status = query.status;
    }

    if (query.featured !== undefined) {
      where.featured = query.featured;
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    } else if (query.categorySlug) {
      where.category = { slug: query.categorySlug, isActive: true };
    }

    if (query.search?.trim()) {
      const search = query.search.trim();
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { variants: { some: { sku: { contains: search, mode: "insensitive" } } } },
      ];
    }

    if (query.minPriceCents !== undefined || query.maxPriceCents !== undefined) {
      where.variants = {
        some: {
          priceCents: {
            ...(query.minPriceCents !== undefined
              ? { gte: query.minPriceCents }
              : {}),
            ...(query.maxPriceCents !== undefined
              ? { lte: query.maxPriceCents }
              : {}),
          },
        },
      };
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput[] =
      query.sort === "name"
        ? [{ name: "asc" }]
        : query.sort === "price_asc" || query.sort === "price_desc"
          ? [{ createdAt: "desc" }]
          : [{ createdAt: "desc" }];

    const [total, products] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        include: productInclude,
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    let sorted = products;
    if (query.sort === "price_asc" || query.sort === "price_desc") {
      sorted = [...products].sort((a, b) => {
        const aMin = Math.min(...a.variants.map((v) => v.priceCents), Infinity);
        const bMin = Math.min(...b.variants.map((v) => v.priceCents), Infinity);
        return query.sort === "price_asc" ? aMin - bMin : bMin - aMin;
      });
    }

    return {
      products: sorted,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async getBySlug(slug: string, publicOnly = false) {
    const product = await this.prisma.product.findFirst({
      where: {
        slug,
        ...(publicOnly ? { status: ProductStatus.ACTIVE } : {}),
      },
      include: productInclude,
    });
    if (!product) throw new NotFoundException("Product not found");
    return product;
  }

  async create(dto: CreateProductDto) {
    await this.ensureCategory(dto.categoryId);
    this.validateVariants(dto.variants);

    const slug = await this.slugService.unique(
      dto.slug ?? dto.name,
      async (candidate) =>
        !!(await this.prisma.product.findUnique({ where: { slug: candidate } })),
    );

    try {
      return await this.prisma.product.create({
        data: {
          name: dto.name.trim(),
          slug,
          description: dto.description.trim(),
          categoryId: dto.categoryId,
          status: dto.status ?? ProductStatus.DRAFT,
          featured: dto.featured ?? false,
          variants: {
            create: dto.variants.map((variant) => ({
              sku: variant.sku.trim().toUpperCase(),
              size: variant.size.trim(),
              color: variant.color.trim(),
              priceCents: variant.priceCents,
              compareAtCents: variant.compareAtCents ?? null,
              stock: variant.stock ?? 0,
            })),
          },
          images: {
            create: this.normalizeImages(dto.images ?? []),
          },
        },
        include: productInclude,
      });
    } catch (error) {
      this.handleUniqueError(error);
      throw error;
    }
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.getById(id);

    if (dto.categoryId) {
      await this.ensureCategory(dto.categoryId);
    }
    if (dto.variants) {
      this.validateVariants(dto.variants);
    }

    let slug = existing.slug;
    if (dto.slug || dto.name) {
      slug = await this.slugService.unique(
        dto.slug ?? dto.name ?? existing.name,
        async (candidate) => {
          const found = await this.prisma.product.findUnique({
            where: { slug: candidate },
          });
          return !!found && found.id !== id;
        },
      );
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        if (dto.variants) {
          await tx.productVariant.deleteMany({ where: { productId: id } });
        }
        if (dto.images) {
          await tx.productImage.deleteMany({ where: { productId: id } });
        }

        return tx.product.update({
          where: { id },
          data: {
            name: dto.name?.trim(),
            slug,
            description: dto.description?.trim(),
            categoryId: dto.categoryId,
            status: dto.status,
            featured: dto.featured,
            ...(dto.variants
              ? {
                  variants: {
                    create: dto.variants.map((variant) => ({
                      sku: variant.sku.trim().toUpperCase(),
                      size: variant.size.trim(),
                      color: variant.color.trim(),
                      priceCents: variant.priceCents,
                      compareAtCents: variant.compareAtCents ?? null,
                      stock: variant.stock ?? 0,
                    })),
                  },
                }
              : {}),
            ...(dto.images
              ? {
                  images: {
                    create: this.normalizeImages(dto.images),
                  },
                }
              : {}),
          },
          include: productInclude,
        });
      });
    } catch (error) {
      this.handleUniqueError(error);
      throw error;
    }
  }

  async bulkStatus(dto: BulkStatusDto) {
    const result = await this.prisma.product.updateMany({
      where: { id: { in: dto.productIds } },
      data: { status: dto.status },
    });
    return { updated: result.count, status: dto.status };
  }

  async adjustStock(dto: AdjustStockDto) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: dto.variantId },
    });
    if (!variant) throw new NotFoundException("Variant not found");

    const nextStock = variant.stock + dto.delta;
    if (nextStock < 0) {
      throw new BadRequestException("Stock cannot go below zero");
    }

    return this.prisma.productVariant.update({
      where: { id: dto.variantId },
      data: { stock: nextStock },
    });
  }

  async remove(id: string) {
    await this.getById(id);
    await this.prisma.product.delete({ where: { id } });
    return { message: "Product deleted" };
  }

  private async ensureCategory(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) throw new NotFoundException("Category not found");
    return category;
  }

  private validateVariants(
    variants: Array<{ sku: string; size: string; color: string }>,
  ) {
    const skus = new Set<string>();
    const combos = new Set<string>();
    for (const variant of variants) {
      const sku = variant.sku.trim().toUpperCase();
      const combo = `${variant.size.trim().toLowerCase()}::${variant.color.trim().toLowerCase()}`;
      if (skus.has(sku)) {
        throw new BadRequestException(`Duplicate SKU: ${sku}`);
      }
      if (combos.has(combo)) {
        throw new BadRequestException(
          `Duplicate size/color combination: ${variant.size} / ${variant.color}`,
        );
      }
      skus.add(sku);
      combos.add(combo);
    }
  }

  private normalizeImages(
    images: Array<{
      url: string;
      alt?: string | null;
      sortOrder?: number;
      isPrimary?: boolean;
    }>,
  ) {
    if (images.length === 0) return [];
    const hasPrimary = images.some((img) => img.isPrimary);
    return images.map((image, index) => ({
      url: image.url.trim(),
      alt: image.alt?.trim() ?? null,
      sortOrder: image.sortOrder ?? index,
      isPrimary: hasPrimary ? !!image.isPrimary : index === 0,
    }));
  }

  private handleUniqueError(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ConflictException(
        "A product or variant with that slug/SKU already exists",
      );
    }
  }
}
