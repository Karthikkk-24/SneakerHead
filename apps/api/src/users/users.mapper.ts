import { User } from "@prisma/client";
import { UserProfile, UserRole, UserStatus } from "@sneakerhead/types";

export function toUserProfile(user: User): UserProfile {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role as UserRole,
    status: user.status as UserStatus,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}
