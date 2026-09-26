import { Module } from "@nestjs/common";
import { AdminCategoriesController } from "./admin-categories.controller";
import { AdminMediaController } from "./admin-media.controller";
import { AdminProductsController } from "./admin-products.controller";
import { CatalogController } from "./catalog.controller";
import { CategoriesService } from "./categories.service";
import { ProductsService } from "./products.service";
import { SlugService } from "./slug.service";

@Module({
  controllers: [
    CatalogController,
    AdminCategoriesController,
    AdminProductsController,
    AdminMediaController,
  ],
  providers: [CategoriesService, ProductsService, SlugService],
  exports: [CategoriesService, ProductsService],
})
export class CatalogModule {}
