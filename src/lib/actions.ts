"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "./prisma";
import { auth } from "./auth";

const engagementSchema = z.object({
  code: z.string().min(3, "Code is required").max(40),
  client: z.string().min(2).max(100),
  industry: z.string().max(60).optional().or(z.literal("")),
  variant: z.string().max(80).optional().or(z.literal("")),
  phase: z.coerce.number().int().min(1).max(4).default(1),
  phaseName: z.string().max(60).optional().or(z.literal("")),
  status: z.string().default("In flight"),
  progress: z.coerce.number().int().min(0).max(100).default(0),
  sponsor: z.string().max(120).optional().or(z.literal("")),
  delivery: z.string().max(120).optional().or(z.literal("")),
  nextGate: z.string().max(10).optional().or(z.literal("")),
  startDate: z.string().optional().or(z.literal("")),
  targetDate: z.string().optional().or(z.literal("")),
  region: z.string().max(40).optional().or(z.literal("EU-Central")),
  notes: z.string().max(4000).optional().or(z.literal("")),
});

export type EngagementFormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function createEngagement(_prev: EngagementFormState, formData: FormData): Promise<EngagementFormState> {
  const session = await auth();
  if (!session?.user?.id) return { message: "Not authenticated" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = engagementSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, message: "Please correct the errors below." };
  }
  const d = parsed.data;

  // Uniqueness check on code
  const existing = await prisma.engagement.findUnique({ where: { code: d.code } });
  if (existing) return { errors: { code: ["That engagement code is already in use"] }, message: "Duplicate code" };

  const created = await prisma.engagement.create({
    data: {
      code: d.code,
      client: d.client,
      industry: d.industry || null,
      variant: d.variant || null,
      phase: d.phase,
      phaseName: d.phaseName || null,
      status: d.status || "In flight",
      progress: d.progress,
      sponsor: d.sponsor || null,
      delivery: d.delivery || null,
      nextGate: d.nextGate || null,
      region: d.region || "EU-Central",
      startDate: d.startDate ? new Date(d.startDate) : null,
      targetDate: d.targetDate ? new Date(d.targetDate) : null,
      notes: d.notes || null,
      createdById: session.user.id,
    },
  });

  revalidatePath("/dashboard");
  redirect(`/engagements/${created.id}`);
}

const stakeholderSchema = z.object({
  engagementId: z.string().min(1),
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  organization: z.string().min(2).max(100),
  role: z.string().min(2).max(80),
  side: z.enum(["Client", "Delivery", "Observer"]).default("Client"),
  influence: z.enum(["High", "Medium", "Low"]).default("High"),
  interest: z.enum(["High", "Medium", "Low"]).default("High"),
  phone: z.string().max(40).optional().or(z.literal("")),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export type StakeholderFormState = {
  errors?: Record<string, string[]>;
  message?: string;
};

export async function addStakeholder(_prev: StakeholderFormState, formData: FormData): Promise<StakeholderFormState> {
  const session = await auth();
  if (!session?.user?.id) return { message: "Not authenticated" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = stakeholderSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, message: "Please correct the errors below." };
  }
  const d = parsed.data;

  // Ensure engagement exists
  const eng = await prisma.engagement.findUnique({ where: { id: d.engagementId } });
  if (!eng) return { message: "Engagement not found" };

  await prisma.stakeholder.create({
    data: {
      engagementId: d.engagementId,
      fullName: d.fullName,
      email: d.email,
      organization: d.organization,
      role: d.role,
      side: d.side,
      influence: d.influence,
      interest: d.interest,
      phone: d.phone || null,
      notes: d.notes || null,
      createdById: session.user.id,
    },
  });

  revalidatePath(`/engagements/${d.engagementId}`);
  redirect(`/engagements/${d.engagementId}?added=1`);
}

export async function deleteStakeholder(id: string, engagementId: string) {
  const session = await auth();
  if (!session?.user?.id) return;
  await prisma.stakeholder.delete({ where: { id } });
  revalidatePath(`/engagements/${engagementId}`);
}
