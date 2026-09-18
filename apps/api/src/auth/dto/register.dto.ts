import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "jane@example.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "Jane Doe" })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: "SecurePass123!" })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  password!: string;

  @ApiPropertyOptional({ example: "+1234567890" })
  @IsOptional()
  @IsString()
  phone?: string;
}
