// prisma/seed.ts — optional sample data (safe to run multiple times)
// Run with: npm run db:seed
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Find or create a system user to own seeded engagements
  const systemEmail = "seed@trustscale.ai";
  let system = await prisma.user.findUnique({ where: { email: systemEmail } });
  if (!system) {
    system = await prisma.user.create({
      data: { email: systemEmail, name: "Seed Bot", role: "system" },
    });
  }

  const engagements = [
    {
      code: "ENG-2026-RB-001",
      client: "Regio Bank",
      industry: "Banking",
      variant: "Variant B · 4-Week Board-Ready",
      phase: 2,
      phaseName: "Assess & Diagnose",
      status: "In flight",
      progress: 58,
      sponsor: "Sanne van Doorn",
      delivery: "Jan Smit",
      nextGate: "G3",
      startDate: new Date("2026-04-29"),
      targetDate: new Date("2026-05-27"),
    },
    {
      code: "ENG-2026-NP-002",
      client: "NordPharma Group",
      industry: "Pharma",
      variant: "Variant A · 8-Week Full",
      phase: 1,
      phaseName: "Scope & Frame",
      status: "In flight",
      progress: 22,
      sponsor: "Aisha Khan",
      delivery: "Ayesha Kwok",
      nextGate: "G2",
      startDate: new Date("2026-04-15"),
      targetDate: new Date("2026-06-12"),
    },
  ];

  for (const e of engagements) {
    await prisma.engagement.upsert({
      where: { code: e.code },
      update: {},
      create: { ...e, createdById: system.id },
    });
  }
  console.log(`Seed complete: ${engagements.length} engagements ensured.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
