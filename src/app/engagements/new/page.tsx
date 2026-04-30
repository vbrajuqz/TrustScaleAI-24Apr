import AppShell from "@/components/AppShell";
import EngagementForm from "@/components/EngagementForm";
import prisma from "@/lib/prisma";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const dynamic = "force-dynamic";

export default async function NewEngagementPage() {
  const [orgs, variants, users] = await Promise.all([
    prisma.organization.findMany({ orderBy: { name: "asc" } }),
    prisma.engagementVariant.findMany({ orderBy: { code: "asc" } }),
    prisma.user.findMany({
      select: { id: true, name: true, email: true, platformRoleCode: true, organizationId: true },
      where: { status: { in: ["Active", "Invited"] } },
      orderBy: { name: "asc" },
    }),
  ]);
  return (
    <AppShell active="new">
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>New</Typography>
        <Typography variant="h1">Create engagement</Typography>
        <Typography sx={{ color: "text.secondary", mt: 0.5, maxWidth: 760 }}>
          All catalog fields (organization, variant, sponsor, delivery lead) are sourced from master data. Add new entries via the Admin module.
        </Typography>
      </Box>
      <EngagementForm orgs={orgs} variants={variants} users={users}/>
    </AppShell>
  );
}
