import { UserRole } from "@prisma/client";

export function isAdmin(user) { 
  if (!user || !user.role) {
    return false;
  }
  
  return (
    isSuperAdmin(user) ||
    user.role === UserRole.ADMIN
  )
}

export function isSuperAdmin(user) {
  if (!user || !user.role) {
    return false;
  }
  
  return user.role === UserRole.SUPERADMIN;
}