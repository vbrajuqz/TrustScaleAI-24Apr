// Permission helpers — built on Role.permissions array (CASL-style tokens).
import prisma from "./prisma";

export async function getRoleForUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { platformRoleCode: true },
  });
  if (!user) return null;
  return prisma.role.findUnique({ where: { code: user.platformRoleCode } });
}

export async function userHasPermission(userId: string, perm: string) {
  const role = await getRoleForUser(userId);
  if (!role) return false;
  // Match exact or wildcard prefix (e.g. "admin.*" grants "admin.users.create")
  return role.permissions.some((p) => {
    if (p === perm) return true;
    if (p.endsWith(".*")) return perm.startsWith(p.slice(0, -1));
    return false;
  });
}

export async function requireAdmin(userId: string) {
  const ok = await userHasPermission(userId, "admin.read");
  if (!ok) {
    const err: Error & { status?: number } = new Error("Forbidden — admin access required");
    err.status = 403;
    throw err;
  }
}

export async function isPlatformAdmin(userId: string): Promise<boolean> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { platformRoleCode: true },
  });
  return u?.platformRoleCode === "PA";
}
