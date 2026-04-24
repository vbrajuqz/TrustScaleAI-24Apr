import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const eng = await prisma.engagement.findUnique({
    where: { id: params.id },
    include: { stakeholders: true },
  });
  if (!eng) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(eng);
}
