import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { Roles } from "../common/decorators/roles.decorator";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { RequestUser } from "../auth/types/request-user.type";
import { PrismaService } from "../prisma/prisma.service";
import { toUserProfile } from "./users.mapper";

@ApiTags("admin")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
@Controller("admin")
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

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
}
