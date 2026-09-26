import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";
import { SlugService } from "./slug.service";

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly slugService: SlugService,
  ) {}

  async list(options: { activeOnly?: boolean } = {}) {
    return this.prisma.category.findMany({
      where: options.activeOnly ? { isActive: true } : undefined,
      include: { _count: { select: { products: true } } },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }

  async getById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!category) throw new NotFoundException("Category not found");
    return category;
  }

  async getBySlug(slug: string, activeOnly = false) {
    const category = await this.prisma.category.findFirst({
      where: {
        slug,
        ...(activeOnly ? { isActive: true } : {}),
      },
      include: { _count: { select: { products: true } } },
    });
    if (!category) throw new NotFoundException("Category not found");
    return category;
  }

  async create(dto: CreateCategoryDto) {
    if (dto.parentId) {
      await this.getById(dto.parentId);
    }

    const slug = await this.slugService.unique(
      dto.slug ?? dto.name,
      async (candidate) =>
        !!(await this.prisma.category.findUnique({ where: { slug: candidate } })),
    );

    try {
      return await this.prisma.category.create({
        data: {
          name: dto.name.trim(),
          slug,
          description: dto.description?.trim() ?? null,
          parentId: dto.parentId ?? null,
          sortOrder: dto.sortOrder ?? 0,
          isActive: dto.isActive ?? true,
        },
        include: { _count: { select: { products: true } } },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("Category slug already exists");
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const existing = await this.getById(id);

    if (dto.parentId === id) {
      throw new BadRequestException("Category cannot be its own parent");
    }
    if (dto.parentId) {
      await this.getById(dto.parentId);
    }

    let slug = existing.slug;
    if (dto.slug || dto.name) {
      slug = await this.slugService.unique(
        dto.slug ?? dto.name ?? existing.name,
        async (candidate) => {
          const found = await this.prisma.category.findUnique({
            where: { slug: candidate },
          });
          return !!found && found.id !== id;
        },
      );
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        slug,
        description:
          dto.description === undefined
            ? undefined
            : dto.description?.trim() ?? null,
        parentId: dto.parentId === undefined ? undefined : dto.parentId,
        sortOrder: dto.sortOrder,
        isActive: dto.isActive,
      },
      include: { _count: { select: { products: true } } },
    });
  }

  async remove(id: string) {
    const category = await this.getById(id);
    if (category._count.products > 0) {
      throw new BadRequestException(
        "Cannot delete category with products. Move or archive products first.",
      );
    }
    await this.prisma.category.delete({ where: { id } });
    return { message: "Category deleted" };
  }
}
