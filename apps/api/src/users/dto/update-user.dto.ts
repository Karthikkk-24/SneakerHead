import { ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole, UserStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "Jane Doe" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
