import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { ProductStatus } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";

export class VariantInputDto {
  @ApiProperty({ example: "NK-AF1-WHT-10" })
  @IsString()
  @MinLength(2)
  sku!: string;

  @ApiProperty({ example: "10" })
  @IsString()
  size!: string;

  @ApiProperty({ example: "White" })
  @IsString()
  color!: string;

  @ApiProperty({ example: 12999 })
  @IsInt()
  @Min(0)
  priceCents!: number;

  @ApiPropertyOptional({ example: 14999 })
  @IsOptional()
  @IsInt()
  @Min(0)
  compareAtCents?: number | null;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;
}

export class ImageInputDto {
  @ApiProperty({ example: "https://images.example.com/shoe.jpg" })
  @IsString()
  @MinLength(4)
  url!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alt?: string | null;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class CreateProductDto {
  @ApiProperty({ example: "Air Force 1" })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiPropertyOptional({ example: "air-force-1" })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  description!: string;

  @ApiProperty()
  @IsUUID()
  categoryId!: string;

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiProperty({ type: [VariantInputDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => VariantInputDto)
  variants!: VariantInputDto[];

  @ApiPropertyOptional({ type: [ImageInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageInputDto)
  images?: ImageInputDto[];
}

export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ type: [VariantInputDto] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => VariantInputDto)
  variants?: VariantInputDto[];

  @ApiPropertyOptional({ type: [ImageInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageInputDto)
  images?: ImageInputDto[];
}

export class ListProductsQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categorySlug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ enum: ProductStatus })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPriceCents?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPriceCents?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === "") return undefined;
    if (value === true || value === "true") return true;
    if (value === false || value === "false") return false;
    return value;
  })
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ example: "price_asc" })
  @IsOptional()
  @IsString()
  sort?: "newest" | "price_asc" | "price_desc" | "name";
}

export class BulkStatusDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID("4", { each: true })
  productIds!: string[];

  @ApiProperty({ enum: ProductStatus })
  @IsEnum(ProductStatus)
  status!: ProductStatus;
}

export class AdjustStockDto {
  @ApiProperty()
  @IsUUID()
  variantId!: string;

  @ApiProperty({ example: -1 })
  @IsInt()
  delta!: number;
}
