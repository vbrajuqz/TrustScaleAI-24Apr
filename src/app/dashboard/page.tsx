import Link from "next/link";
import prisma from "@/lib/prisma";
import AppShell from "@/components/AppShell";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

export const dynamic = "force-dynamic";

function KPI({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <Paper sx={{ p: 2, border: "1px solid #E2E8F0", minWidth: 0 }}>
      <Typography sx={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>{label}</Typography>
      <Typography sx={{ fontSize: 26, fontWeight: 800, fontFamily: "Manrope, sans-serif", mt: 0.5, lineHeight: 1.15 }}>{value}</Typography>
      {sub && <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}>{sub}</Typography>}
    </Paper>
  );
}

export default async function Dashboard() {
  const engagements = await prisma.engagement.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      organization: true,
      variant: true,
      sponsorUser: true,
      deliveryLeadUser: true,
      _count: { select: { stakeholders: true } },
    },
  });
  const active = engagements.filter(e => !e.status.toLowerCase().includes("closed")).length;
  const totalStakeholders = engagements.reduce((a, e) => a + e._count.stakeholders, 0);

  return (
    <AppShell active="engagements">
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: 2, pb: 2, borderBottom: "1px solid #E2E8F0", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>Workspace</Typography>
          <Typography variant="h1">My engagements</Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.5 }}>Click any engagement to manage stakeholders and adjust V×F×R weighting.</Typography>
        </Box>
        <Button component={Link} href="/engagements/new" variant="contained">+ New engagement</Button>
      </Box>

      <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0,1fr))", md: "repeat(4, minmax(0,1fr))" }, mb: 2.5 }}>
        <KPI label="Engagements" value={engagements.length} sub={`${active} active · ${engagements.length-active} closed`}/>
        <KPI label="Stakeholders" value={totalStakeholders} sub="Across all engagements"/>
        <KPI label="Variants in use" value={new Set(engagements.map(e => e.variantCode)).size} sub="VA/VB/VC catalog"/>
        <KPI label="Region" value="EU-Central" sub="Primary data region"/>
      </Box>

      {engagements.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center", border: "1px dashed #CBD5E0" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 0.5 }}>No engagements yet</Typography>
          <Typography sx={{ color: "text.secondary", mb: 2 }}>Create your first engagement using master data already provisioned in Admin.</Typography>
          <Button component={Link} href="/engagements/new" variant="contained">+ Create first engagement</Button>
        </Paper>
      ) : (
        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0,1fr))" } }}>
          {engagements.map(e => (
            <Paper key={e.id} component={Link} href={`/engagements/${e.id}`} sx={{ p: 0, border: "1px solid #E2E8F0", textDecoration: "none", color: "inherit", "&:hover": { borderColor: "#38B2AC", boxShadow: "0 4px 12px rgba(0,0,0,.06)" } }}>
              <Box sx={{ p: 2, borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>{e.industry || e.organization.type} · Phase {e.phase}</Typography>
                  <Typography sx={{ fontSize: 17, fontWeight: 700, fontFamily: "Manrope, sans-serif", mt: 0.5 }}>{e.client}</Typography>
                  <Typography sx={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11.5, color: "text.secondary" }}>{e.code}</Typography>
                </Box>
                <Chip size="small" label={e.status} color={e.status==="Closed"?"default":e.status.includes("hold")?"warning":"success"}/>
              </Box>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 1.5 }}>
                  <Chip size="small" label={e.variant.label.split("·")[0].trim()} sx={{ background:"#0B2240", color:"#fff" }}/>
                  {e.sponsorUser && <Chip size="small" label={`Sponsor · ${e.sponsorUser.name}`} variant="outlined"/>}
                  {e.deliveryLeadUser && <Chip size="small" label={`Lead · ${e.deliveryLeadUser.name}`} variant="outlined"/>}
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 0.7, fontSize: 13, mb: 1.5 }}>
                  <Typography sx={{ color: "text.secondary", fontSize: 13, fontWeight: 600 }}>Phase</Typography><Typography sx={{ fontSize: 13 }}>{e.phaseName || "—"}</Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: 13, fontWeight: 600 }}>Next gate</Typography><Typography sx={{ fontSize: 13 }}>{e.nextGate || "—"}</Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: 13, fontWeight: 600 }}>Stakeholders</Typography><Typography sx={{ fontSize: 13 }}>{e._count.stakeholders}</Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </AppShell>
  );
}
