import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rows = await prisma.engagement.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      organization: { select: { name: true, type: true } },
      variant: { select: { label: true, durationWeeks: true } },
      _count: { select: { stakeholders: true } },
    },
  });
  return NextResponse.json(rows);
}
