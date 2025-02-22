import { UserRole } from "@prisma/client";

export function isAdmin(user) { 
  return (
    isSuperAdmin(user) ||
    user.role === UserRole.ADMIN
  )
}

export function isSuperAdmin(user) {
  return user.role === UserRole.SUPERADMIN;
}