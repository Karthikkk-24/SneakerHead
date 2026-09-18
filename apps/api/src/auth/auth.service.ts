import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User, UserRole, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtPayload } from "./types/jwt-payload.type";
import { generateSecureToken, hashToken } from "./utils/token.util";

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResult> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException("Email already registered");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name.trim(),
        phone: dto.phone?.trim() ?? null,
        passwordHash,
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
        emailVerified: false,
      },
    });

    this.logger.log(`Verification email stub sent to ${user.email}`);

    return this.issueTokens(user);
  }

  async login(
    dto: LoginDto,
    ipAddress?: string,
  ): Promise<AuthResult> {
    await this.enforceRateLimit(`auth:login:${dto.email.toLowerCase()}`, 10, 900);

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (user.status === UserStatus.DISABLED) {
      throw new UnauthorizedException("Account is disabled");
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
      await this.prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "ADMIN_LOGIN",
          ipAddress: ipAddress ?? null,
          metadata: { email: user.email },
        },
      });
    }

    return this.issueTokens(user);
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    const tokenHash = hashToken(refreshToken);
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (
      !storedToken ||
      storedToken.revokedAt ||
      storedToken.expiresAt < new Date()
    ) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    if (storedToken.user.status === UserStatus.DISABLED) {
      throw new UnauthorizedException("Account is disabled");
    }

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(storedToken.user);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string; resetToken?: string }> {
    await this.enforceRateLimit(
      `auth:forgot:${dto.email.toLowerCase()}`,
      5,
      3600,
    );

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    const message =
      "If an account exists for this email, a password reset link has been sent.";

    if (!user) {
      return { message };
    }

    const rawToken = generateSecureToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawToken),
        expiresAt,
      },
    });

    this.logger.log(
      `Password reset stub for ${user.email}. Token: ${rawToken}`,
    );

    const isDev = this.configService.get<string>("NODE_ENV") !== "production";
    return isDev ? { message, resetToken: rawToken } : { message };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const tokenHash = hashToken(dto.token);
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (
      !resetToken ||
      resetToken.usedAt ||
      resetToken.expiresAt < new Date()
    ) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: resetToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { message: "Password reset successfully" };
  }

  private async issueTokens(user: User): Promise<AuthResult> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>("JWT_ACCESS_SECRET"),
      expiresIn: this.configService.get<string>("JWT_ACCESS_EXPIRES_IN", "15m"),
    });

    const refreshToken = generateSecureToken();
    const refreshExpiresIn = this.configService.get<string>(
      "JWT_REFRESH_EXPIRES_IN",
      "7d",
    );
    const expiresAt = this.parseExpiry(refreshExpiresIn);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt,
      },
    });

    return { user, accessToken, refreshToken };
  }

  private parseExpiry(duration: string): Date {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const value = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return new Date(Date.now() + value * multipliers[unit]);
  }

  private async enforceRateLimit(
    key: string,
    maxAttempts: number,
    ttlSeconds: number,
  ): Promise<void> {
    try {
      const count = await this.redisService.incrementWithExpiry(key, ttlSeconds);
      if (count > maxAttempts) {
        throw new UnauthorizedException(
          "Too many attempts. Please try again later.",
        );
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
    }
  }
}
