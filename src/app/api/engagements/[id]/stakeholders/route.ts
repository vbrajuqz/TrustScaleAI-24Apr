import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  organization: z.string().min(2),
  role: z.string().min(2),
  side: z.enum(["Client", "Delivery", "Observer"]).default("Client"),
  influence: z.enum(["High", "Medium", "Low"]).default("High"),
  interest: z.enum(["High", "Medium", "Low"]).default("High"),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rows = await prisma.stakeholder.findMany({
    where: { engagementId: params.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const eng = await prisma.engagement.findUnique({ where: { id: params.id } });
  if (!eng) return NextResponse.json({ error: "engagement_not_found" }, { status: 404 });
  const created = await prisma.stakeholder.create({
    data: { ...parsed.data, engagementId: params.id, createdById: session.user.id },
  });
  return NextResponse.json(created, { status: 201 });
}
