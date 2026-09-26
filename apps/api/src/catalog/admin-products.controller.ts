import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { toProductDetail, toVariantDto } from "./catalog.mapper";
import {
  AdjustStockDto,
  BulkStatusDto,
  CreateProductDto,
  ListProductsQueryDto,
  UpdateProductDto,
} from "./dto/product.dto";
import { ProductsService } from "./products.service";

@ApiTags("admin-products")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller("admin/products")
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async list(@Query() query: ListProductsQueryDto) {
    const result = await this.productsService.list(query);
    return {
      data: result.products.map(toProductDetail),
      meta: result.meta,
    };
  }

  @Get(":id")
  async get(@Param("id", ParseUUIDPipe) id: string) {
    return toProductDetail(await this.productsService.getById(id));
  }

  @Post()
  async create(@Body() dto: CreateProductDto) {
    return toProductDetail(await this.productsService.create(dto));
  }

  @Patch("bulk-status")
  async bulkStatus(@Body() dto: BulkStatusDto) {
    return this.productsService.bulkStatus(dto);
  }

  @Patch("stock")
  async adjustStock(@Body() dto: AdjustStockDto) {
    return toVariantDto(await this.productsService.adjustStock(dto));
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return toProductDetail(await this.productsService.update(id, dto));
  }

  @Delete(":id")
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
