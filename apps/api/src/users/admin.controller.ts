import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Request } from "express";
import { Roles } from "../common/decorators/roles.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { RequestUser } from "../auth/types/request-user.type";
import { PrismaService } from "../prisma/prisma.service";
import { ListUsersQueryDto } from "./dto/list-users.query.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { toUserProfile } from "./users.mapper";
import { UsersService } from "./users.service";

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller("admin")
export class AdminController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  @Get("dashboard")
  async getDashboard(@CurrentUser() user: RequestUser) {
    const [customerCount, orderCountPlaceholder, recentAuditLogs] =
      await Promise.all([
        this.prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
        Promise.resolve(0),
        this.prisma.auditLog.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { email: true, name: true } },
          },
        }),
      ]);

    return {
      admin: toUserProfile(
        await this.prisma.user.findUniqueOrThrow({ where: { id: user.id } }),
      ),
      stats: {
        customers: customerCount,
        orders: orderCountPlaceholder,
        revenue: 0,
      },
      recentActivity: recentAuditLogs.map((log) => ({
        id: log.id,
        action: log.action,
        createdAt: log.createdAt.toISOString(),
        user: log.user
          ? { name: log.user.name, email: log.user.email }
          : null,
      })),
    };
  }

  @Get("profile")
  async getProfile(@CurrentUser() user: RequestUser) {
    const profile = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
    });
    return toUserProfile(profile);
  }

  @Get("users")
  async listUsers(@Query() query: ListUsersQueryDto) {
    const result = await this.usersService.listUsers(query);
    return {
      data: result.users.map(toUserProfile),
      meta: result.meta,
    };
  }

  @Get("users/:id")
  async getUser(@Param("id", ParseUUIDPipe) id: string) {
    const user = await this.usersService.getUserById(id);
    return toUserProfile(user);
  }

  @Patch("users/:id")
  async updateUser(
    @CurrentUser() actor: RequestUser,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip ?? req.socket.remoteAddress;
    const user = await this.usersService.updateUser(actor, id, dto, ipAddress);
    return toUserProfile(user);
  }

  @Post("users/:id/force-logout")
  @HttpCode(HttpStatus.OK)
  async forceLogout(
    @CurrentUser() actor: RequestUser,
    @Param("id", ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip ?? req.socket.remoteAddress;
    return this.usersService.forceLogout(actor, id, ipAddress);
  }
}
