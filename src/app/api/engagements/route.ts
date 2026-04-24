import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rows = await prisma.engagement.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { stakeholders: true } } },
  });
  return NextResponse.json(rows);
}

const createSchema = z.object({
  code: z.string().min(3),
  client: z.string().min(2),
  industry: z.string().optional(),
  variant: z.string().optional(),
  phase: z.number().int().min(1).max(4).default(1),
  phaseName: z.string().optional(),
  status: z.string().default("In flight"),
  progress: z.number().int().min(0).max(100).default(0),
  sponsor: z.string().optional(),
  delivery: z.string().optional(),
  nextGate: z.string().optional(),
  startDate: z.string().optional(),
  targetDate: z.string().optional(),
  region: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const d = parsed.data;
  const existing = await prisma.engagement.findUnique({ where: { code: d.code } });
  if (existing) return NextResponse.json({ error: "duplicate_code" }, { status: 409 });
  const created = await prisma.engagement.create({
    data: {
      ...d,
      startDate: d.startDate ? new Date(d.startDate) : null,
      targetDate: d.targetDate ? new Date(d.targetDate) : null,
      createdById: session.user.id,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
