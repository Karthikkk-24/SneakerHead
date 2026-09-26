import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import {
  toCategorySummary,
  toProductDetail,
  toProductSummary,
} from "./catalog.mapper";
import { ListProductsQueryDto } from "./dto/product.dto";
import { ProductsService } from "./products.service";

@ApiTags("catalog")
@Controller("catalog")
export class CatalogController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
  ) {}

  @Get("categories")
  async listCategories() {
    const categories = await this.categoriesService.list({ activeOnly: true });
    return categories.map(toCategorySummary);
  }

  @Get("categories/:slug")
  async getCategory(@Param("slug") slug: string) {
    return toCategorySummary(
      await this.categoriesService.getBySlug(slug, true),
    );
  }

  @Get("products")
  async listProducts(@Query() query: ListProductsQueryDto) {
    const result = await this.productsService.list(query, { publicOnly: true });
    return {
      data: result.products.map(toProductSummary),
      meta: result.meta,
    };
  }

  @Get("products/:slug")
  async getProduct(@Param("slug") slug: string) {
    return toProductDetail(
      await this.productsService.getBySlug(slug, true),
    );
  }
}
