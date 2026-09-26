import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { diskStorage } from "multer";
import { extname, join } from "path";
import { existsSync, mkdirSync } from "fs";
import { randomUUID } from "crypto";
import { ConfigService } from "@nestjs/config";
import { Roles } from "../common/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";

const UPLOAD_DIR = join(process.cwd(), "uploads");

@ApiTags("admin-media")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller("admin/media")
export class AdminMediaController {
  constructor(private readonly configService: ConfigService) {
    if (!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true });
    }
  }

  @Post("upload")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
        filename: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase() || ".jpg";
          cb(null, `${randomUUID()}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
          cb(new BadRequestException("Only image uploads are allowed") as never, false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  upload(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("File is required");
    }

    const apiUrl = this.configService.get<string>(
      "API_URL",
      "http://localhost:3001",
    );

    return {
      url: `${apiUrl}/uploads/${file.filename}`,
      filename: file.filename,
      size: file.size,
      mimeType: file.mimetype,
    };
  }
}
