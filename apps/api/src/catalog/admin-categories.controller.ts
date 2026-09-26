import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CategoriesService } from "./categories.service";
import { toCategorySummary } from "./catalog.mapper";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto";

@ApiTags("admin-categories")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller("admin/categories")
export class AdminCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async list() {
    const categories = await this.categoriesService.list();
    return categories.map(toCategorySummary);
  }

  @Get(":id")
  async get(@Param("id", ParseUUIDPipe) id: string) {
    return toCategorySummary(await this.categoriesService.getById(id));
  }

  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return toCategorySummary(await this.categoriesService.create(dto));
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return toCategorySummary(await this.categoriesService.update(id, dto));
  }

  @Delete(":id")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }
}
