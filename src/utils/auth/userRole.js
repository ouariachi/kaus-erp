import { UserRole } from "@prisma/client";

export function isAdmin(user) { 
  if (!user) {
    return false;
  }
  
  return (
    isSuperAdmin(user) ||
    user.role === UserRole.ADMIN
  )
}

export function isSuperAdmin(user) {
  if (!user) {
    return false;
  }
  
  return user.role === UserRole.SUPERADMIN;
}