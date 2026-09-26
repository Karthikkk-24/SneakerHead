import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { RequestUser } from "../auth/types/request-user.type";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ListUsersQueryDto } from "./dto/list-users.query.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    if (dto.email) {
      const existing = await this.prisma.user.findFirst({
        where: {
          email: dto.email.toLowerCase(),
          NOT: { id: userId },
        },
      });
      if (existing) {
        throw new ConflictException("Email already in use");
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name?.trim(),
        email: dto.email?.toLowerCase(),
        phone: dto.phone?.trim(),
      },
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const valid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!valid) {
      throw new BadRequestException("Current password is incorrect");
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: "PASSWORD_CHANGED",
        metadata: { source: "self" },
      },
    });

    return { message: "Password updated successfully" };
  }

  async listUsers(query: ListUsersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (query.role) {
      where.role = query.role;
    }
    if (query.status) {
      where.status = query.status;
    }
    if (query.search?.trim()) {
      const search = query.search.trim();
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, users] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return {
      users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async updateUser(
    actor: RequestUser,
    targetUserId: string,
    dto: UpdateUserDto,
    ipAddress?: string,
  ) {
    if (!dto.name && !dto.role && !dto.status) {
      throw new BadRequestException("No updates provided");
    }

    const target = await this.getUserById(targetUserId);

    if (dto.role && dto.role !== target.role) {
      this.assertCanChangeRole(actor, target, dto.role);
    }

    if (dto.status && dto.status !== target.status) {
      this.assertCanChangeStatus(actor, target);
    }

    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        name: dto.name?.trim(),
        role: dto.role,
        status: dto.status,
      },
    });

    if (dto.status === UserStatus.DISABLED && target.status !== UserStatus.DISABLED) {
      await this.revokeRefreshTokens(targetUserId);
    }

    const changes: Record<string, { from: string; to: string }> = {};
    if (dto.name && dto.name.trim() !== target.name) {
      changes.name = { from: target.name, to: updated.name };
    }
    if (dto.role && dto.role !== target.role) {
      changes.role = { from: target.role, to: updated.role };
    }
    if (dto.status && dto.status !== target.status) {
      changes.status = { from: target.status, to: updated.status };
    }

    if (Object.keys(changes).length > 0) {
      await this.prisma.auditLog.create({
        data: {
          userId: actor.id,
          action: "ADMIN_USER_UPDATED",
          ipAddress: ipAddress ?? null,
          metadata: {
            targetUserId,
            targetEmail: target.email,
            changes,
          },
        },
      });
    }

    return updated;
  }

  async forceLogout(actor: RequestUser, targetUserId: string, ipAddress?: string) {
    if (actor.id === targetUserId) {
      throw new ForbiddenException("You cannot force-logout your own session this way");
    }

    const target = await this.getUserById(targetUserId);

    if (
      target.role === UserRole.SUPER_ADMIN &&
      actor.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException("Only super admins can force-logout super admins");
    }

    const result = await this.revokeRefreshTokens(targetUserId);

    await this.prisma.auditLog.create({
      data: {
        userId: actor.id,
        action: "ADMIN_FORCE_LOGOUT",
        ipAddress: ipAddress ?? null,
        metadata: {
          targetUserId,
          targetEmail: target.email,
          revokedSessions: result.count,
        },
      },
    });

    return {
      message: "All active sessions revoked",
      revokedSessions: result.count,
    };
  }

  private async revokeRefreshTokens(userId: string) {
    return this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private assertCanChangeRole(
    actor: RequestUser,
    target: { id: string; role: UserRole },
    nextRole: UserRole,
  ) {
    if (actor.id === target.id) {
      throw new ForbiddenException("You cannot change your own role");
    }

    if (actor.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException("Only super admins can change roles");
    }

    if (
      target.role === UserRole.SUPER_ADMIN &&
      nextRole !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException("Cannot demote a super admin");
    }
  }

  private assertCanChangeStatus(
    actor: RequestUser,
    target: { id: string; role: UserRole },
  ) {
    if (actor.id === target.id) {
      throw new ForbiddenException("You cannot change your own status");
    }

    if (
      target.role === UserRole.SUPER_ADMIN &&
      actor.role !== UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException("Only super admins can modify super admins");
    }
  }
}
