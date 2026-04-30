"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "./prisma";
import { auth } from "./auth";

// ============== CREATE ENGAGEMENT ==============
// All FK fields validated against existing master data (no free-text where catalog exists).

const createEngagementSchema = z.object({
  code:               z.string().min(3).max(40).regex(/^ENG-\d{4}-[A-Z0-9]{2,8}-\d{3,4}$/, "Format: ENG-YYYY-XX-NNN"),
  organizationId:     z.string().min(1, "Pick an organization"),
  variantCode:        z.enum(["VA","VB","VC"]),
  industry:           z.string().max(60).optional().or(z.literal("")),
  phase:              z.coerce.number().int().min(1).max(4).default(1),
  phaseName:          z.string().max(60).optional().or(z.literal("")),
  nextGate:           z.enum(["G1","G2","G3","G4"]).optional().or(z.literal("")),
  status:             z.enum(["In flight","On hold","Trial","Closed"]).default("In flight"),
  region:             z.enum(["EU-Central","EU-West","US-East","APAC-SG"]).default("EU-Central"),
  sponsorUserId:      z.string().min(1, "Pick a client sponsor"),
  deliveryLeadUserId: z.string().min(1, "Pick a delivery lead"),
  startDate:          z.string().optional().or(z.literal("")),
  targetDate:         z.string().optional().or(z.literal("")),
  notes:              z.string().max(4000).optional().or(z.literal("")),
  // VFRWeight initial values (Engagement Lead can preset context)
  vfrContext:         z.enum(["Default","Regulated","Innovation","Execution"]).default("Default"),
});

export type EngagementFormState = { errors?: Record<string,string[]>; message?: string };

const PRESETS: Record<string, { v: number; f: number; r: number }> = {
  Default:    { v: 0.40, f: 0.35, r: 0.25 },
  Regulated:  { v: 0.35, f: 0.35, r: 0.30 },
  Innovation: { v: 0.45, f: 0.40, r: 0.15 },
  Execution:  { v: 0.30, f: 0.50, r: 0.20 },
};

export async function createEngagement(_prev: EngagementFormState, formData: FormData): Promise<EngagementFormState> {
  const session = await auth();
  if (!session?.user?.id) return { message: "Not authenticated" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = createEngagementSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, message: "Please correct the errors below." };
  }
  const d = parsed.data;

  // Verify FK targets exist (server-side enforcement of master-data integrity)
  const [org, variant, sponsor, delivery] = await Promise.all([
    prisma.organization.findUnique({ where: { id: d.organizationId } }),
    prisma.engagementVariant.findUnique({ where: { code: d.variantCode } }),
    prisma.user.findUnique({ where: { id: d.sponsorUserId } }),
    prisma.user.findUnique({ where: { id: d.deliveryLeadUserId } }),
  ]);
  if (!org)      return { errors: { organizationId: ["Organization not found"] }, message: "Invalid organization." };
  if (!variant)  return { errors: { variantCode: ["Variant not found"] }, message: "Invalid variant." };
  if (!sponsor)  return { errors: { sponsorUserId: ["Sponsor user not found"] }, message: "Invalid sponsor." };
  if (!delivery) return { errors: { deliveryLeadUserId: ["Delivery lead user not found"] }, message: "Invalid delivery lead." };

  const existing = await prisma.engagement.findUnique({ where: { code: d.code } });
  if (existing) return { errors: { code: ["This engagement code is already in use"] }, message: "Duplicate code." };

  const preset = PRESETS[d.vfrContext];

  const created = await prisma.$transaction(async (tx) => {
    const eng = await tx.engagement.create({
      data: {
        code: d.code,
        organizationId: d.organizationId,
        client: org.name,
        industry: d.industry || null,
        variantCode: d.variantCode,
        phase: d.phase,
        phaseName: d.phaseName || null,
        nextGate: d.nextGate || null,
        status: d.status,
        region: d.region,
        sponsorUserId: d.sponsorUserId,
        deliveryLeadUserId: d.deliveryLeadUserId,
        startDate: d.startDate ? new Date(d.startDate) : null,
        targetDate: d.targetDate ? new Date(d.targetDate) : null,
        notes: d.notes || null,
        createdById: session.user.id,
      },
    });
    // Auto-create VFRWeight (1:1 per data model #13)
    await tx.vFRWeight.create({
      data: {
        engagementId: eng.id,
        valueWeight: preset.v,
        feasibilityWeight: preset.f,
        riskAttractivenessWeight: preset.r,
        context: d.vfrContext,
        updatedById: session.user.id,
      },
    });
    // Add the Engagement Lead (delivery lead) as Owner team member
    await tx.teamMember.create({
      data: {
        engagementId: eng.id,
        userId: d.deliveryLeadUserId,
        roleCode: "EL",
        access: "Owner",
        organization: "QualiZeal",
      },
    });
    // Add the Sponsor as Gate approver team member
    await tx.teamMember.create({
      data: {
        engagementId: eng.id,
        userId: d.sponsorUserId,
        roleCode: "ES",
        access: "Gate approver",
        organization: org.name,
      },
    });
    return eng;
  });

  revalidatePath("/dashboard");
  redirect(`/engagements/${created.id}`);
}

// ============== ADD STAKEHOLDER ==============

const stakeholderSchema = z.object({
  engagementId: z.string().min(1),
  fullName:     z.string().min(2).max(120),
  email:        z.string().email().max(255).transform(s => s.toLowerCase()),
  phone:        z.string().max(40).optional().or(z.literal("")),
  organization: z.string().min(2).max(120),
  role:         z.string().min(2).max(80),
  function:     z.enum(["Risk","Compliance","Operations","Data","IT","Finance","Business"]),
  influence:    z.enum(["High","Medium","Low"]).default("High"),
  interest:     z.enum(["High","Medium","Low"]).default("High"),
  side:         z.enum(["Client","Delivery","Observer"]).default("Client"),
  dataOwner:    z.string().optional().transform(v => v === "on" || v === "true"),
  riskLevel:    z.enum(["Low","Medium","High"]).default("Medium"),
  notes:        z.string().max(2000).optional().or(z.literal("")),
});

export type StakeholderFormState = { errors?: Record<string,string[]>; message?: string };

export async function addStakeholder(_prev: StakeholderFormState, formData: FormData): Promise<StakeholderFormState> {
  const session = await auth();
  if (!session?.user?.id) return { message: "Not authenticated" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = stakeholderSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, message: "Please correct the errors below." };
  }
  const d = parsed.data;

  const eng = await prisma.engagement.findUnique({ where: { id: d.engagementId } });
  if (!eng) return { message: "Engagement not found" };

  await prisma.stakeholder.create({
    data: {
      engagementId: d.engagementId,
      fullName: d.fullName,
      email: d.email,
      phone: d.phone || null,
      organization: d.organization,
      role: d.role,
      function: d.function,
      influence: d.influence,
      interest: d.interest,
      side: d.side,
      dataOwner: d.dataOwner,
      riskLevel: d.riskLevel,
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

// ============== UPDATE VFR WEIGHTS ==============

const vfrSchema = z.object({
  engagementId:               z.string().min(1),
  valueWeight:                z.coerce.number().min(0.05).max(0.90),
  feasibilityWeight:          z.coerce.number().min(0.05).max(0.90),
  riskAttractivenessWeight:   z.coerce.number().min(0.05).max(0.90),
  context:                    z.enum(["Default","Regulated","Innovation","Execution"]),
  rationale:                  z.string().min(10, "Required when changing weights").max(1000),
});

export type VFRState = { errors?: Record<string,string[]>; message?: string };

export async function updateVFRWeights(_prev: VFRState, formData: FormData): Promise<VFRState> {
  const session = await auth();
  if (!session?.user?.id) return { message: "Not authenticated" };

  const raw = Object.fromEntries(formData.entries());
  const parsed = vfrSchema.safeParse(raw);
  if (!parsed.success) return { errors: parsed.error.flatten().fieldErrors, message: "Please correct the errors below." };
  const d = parsed.data;

  // Validate weights sum to 1.0 ± 0.005
  const sum = d.valueWeight + d.feasibilityWeight + d.riskAttractivenessWeight;
  if (Math.abs(sum - 1.0) > 0.005) {
    return { errors: { valueWeight: [`Weights must sum to 1.000 (currently ${sum.toFixed(3)})`] }, message: "Invalid weights." };
  }

  await prisma.vFRWeight.update({
    where: { engagementId: d.engagementId },
    data: {
      valueWeight: d.valueWeight,
      feasibilityWeight: d.feasibilityWeight,
      riskAttractivenessWeight: d.riskAttractivenessWeight,
      context: d.context,
      rationale: d.rationale,
      updatedById: session.user.id,
    },
  });
  revalidatePath(`/engagements/${d.engagementId}`);
  return { message: "Weights updated" };
}
