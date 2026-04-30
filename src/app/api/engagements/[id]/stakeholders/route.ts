import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const rows = await prisma.stakeholder.findMany({
    where: { engagementId: params.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rows);
}
