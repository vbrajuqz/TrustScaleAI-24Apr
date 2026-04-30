"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "./prisma";
import { auth } from "./auth";
import { isPlatformAdmin } from "./permissions";

async function requirePA() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("not_authenticated");
  if (!(await isPlatformAdmin(session.user.id))) throw new Error("forbidden");
  return session.user.id;
}

const orgSchema = z.object({
  name:    z.string().min(2).max(120),
  type:    z.enum(["Platform","Client","Partner"]),
  domain:  z.string().min(3).max(255).regex(/^[a-z0-9.-]+\.[a-z]{2,}$/i, "Must look like a domain"),
  plan:    z.enum(["Trial","Advisory","Enterprise"]),
  status:  z.enum(["Active","Trial","Provisioning","Suspended"]),
  region:  z.enum(["EU-Central","EU-West","US-East","APAC-SG"]),
  seats:   z.coerce.number().int().min(1).max(10000),
});

export type OrgState = { errors?: Record<string,string[]>; message?: string };

export async function createOrganization(_p: OrgState, fd: FormData): Promise<OrgState> {
  await requirePA();
  const raw = Object.fromEntries(fd.entries());
  const parsed = orgSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors, message: "Please correct the errors." };
  const exists = await prisma.organization.findUnique({ where: { domain: parsed.data.domain } });
  if (exists) return { errors: { domain: ["This domain is already registered"] }, message: "Duplicate domain." };
  const created = await prisma.organization.create({ data: parsed.data });
  revalidatePath("/admin/organizations");
  redirect(`/admin/organizations/${created.id}`);
}

export async function updateOrganization(id: string, fd: FormData): Promise<OrgState> {
  await requirePA();
  const raw = Object.fromEntries(fd.entries());
  const parsed = orgSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors, message: "Please correct the errors." };
  await prisma.organization.update({ where: { id }, data: parsed.data });
  revalidatePath("/admin/organizations");
  revalidatePath(`/admin/organizations/${id}`);
  return { message: "Saved" };
}

const userSchema = z.object({
  name:             z.string().min(2).max(120),
  email:            z.string().email().max(255).transform(s => s.toLowerCase()),
  organizationId:   z.string().min(1),
  platformRoleCode: z.enum(["PA","EL","SC","EA","RG","QE","BA","PMO","AI","ES","ST"]),
  status:           z.enum(["Active","Invited","Pending","Deactivated"]),
});

export type UserState = { errors?: Record<string,string[]>; message?: string };

export async function createUser(_p: UserState, fd: FormData): Promise<UserState> {
  await requirePA();
  const raw = Object.fromEntries(fd.entries());
  const parsed = userSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors, message: "Please correct the errors." };
  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return { errors: { email: ["This email is already registered"] }, message: "Duplicate email." };
  const initials = parsed.data.name.split(/\s+/).map(s => s[0]).slice(0, 2).join("").toUpperCase();
  await prisma.user.create({ data: { ...parsed.data, initials } });
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function updateUserRole(userId: string, platformRoleCode: string): Promise<void> {
  await requirePA();
  if (!["PA","EL","SC","EA","RG","QE","BA","PMO","AI","ES","ST"].includes(platformRoleCode)) {
    throw new Error("Invalid role code");
  }
  await prisma.user.update({ where: { id: userId }, data: { platformRoleCode } });
  revalidatePath("/admin/users");
}
