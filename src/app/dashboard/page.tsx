import Link from "next/link";
import prisma from "@/lib/prisma";
import AppShell from "@/components/AppShell";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

export const dynamic = "force-dynamic";

function KPI({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <Paper sx={{ p: 2, border: "1px solid #E2E8F0", minWidth: 0 }}>
      <Typography sx={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 26, fontWeight: 800, fontFamily: "Manrope", mt: 0.5, lineHeight: 1.15 }}>{value}</Typography>
      {sub && <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}>{sub}</Typography>}
    </Paper>
  );
}

export default async function DashboardPage() {
  const engagements = await prisma.engagement.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { stakeholders: true } } },
  });
  const active = engagements.filter((e) => !e.status.toLowerCase().includes("closed")).length;
  const totalStakeholders = engagements.reduce((a, e) => a + e._count.stakeholders, 0);

  return (
    <AppShell active="engagements">
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: 2, pb: 2, borderBottom: "1px solid #E2E8F0", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography sx={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>
            Workspace
          </Typography>
          <Typography variant="h1" sx={{ mt: 0.5 }}>My engagements</Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.5, maxWidth: 760 }}>
            All engagements provisioned against this platform. Click any engagement to view details and manage stakeholders.
          </Typography>
        </Box>
        <Button component={Link} href="/engagements/new" variant="contained" color="primary">+ New engagement</Button>
      </Box>

      <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0,1fr))", md: "repeat(4, minmax(0,1fr))" }, mb: 2.5 }}>
        <KPI label="Engagements" value={engagements.length} sub={`${active} active · ${engagements.length - active} closed`} />
        <KPI label="Stakeholders" value={totalStakeholders} sub="Across all engagements" />
        <KPI label="Next gate ceremonies" value={engagements.filter((e) => e.nextGate).length} sub="G-level signoffs pending" />
        <KPI label="Region" value="EU-Central" sub="Primary data region" />
      </Box>

      {engagements.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: "center", border: "1px dashed #CBD5E0" }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 0.5 }}>No engagements yet</Typography>
          <Typography sx={{ color: "text.secondary", mb: 2 }}>
            Create your first engagement to start the TrustScaleAI method workflow.
          </Typography>
          <Button component={Link} href="/engagements/new" variant="contained">+ Create first engagement</Button>
        </Paper>
      ) : (
        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0,1fr))" } }}>
          {engagements.map((e) => (
            <Paper key={e.id} sx={{ p: 0, border: "1px solid #E2E8F0", cursor: "pointer", "&:hover": { borderColor: "#38B2AC", boxShadow: "0 4px 12px rgba(0,0,0,.06)" } }} component={Link} href={`/engagements/${e.id}`}>
              <Box sx={{ p: 2, borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>
                    {e.industry || "—"} · Phase {e.phase}
                  </Typography>
                  <Typography sx={{ fontSize: 17, fontWeight: 700, fontFamily: "Manrope", mt: 0.5, wordBreak: "break-word" }}>{e.client}</Typography>
                  <Typography sx={{ fontFamily: "JetBrains Mono, monospace", fontSize: 11.5, color: "text.secondary" }}>{e.code}</Typography>
                </Box>
                <Chip label={e.status} size="small" color={e.status.toLowerCase().includes("closed") ? "default" : e.status.toLowerCase().includes("hold") ? "warning" : "success"} />
              </Box>
              <Box sx={{ p: 2 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: "wrap", gap: 0.5 }}>
                  {e.variant && <Chip label={e.variant} size="small" sx={{ bgcolor: "#0B2240", color: "#fff" }} />}
                  {e.sponsor && <Chip label={`Sponsor · ${e.sponsor}`} size="small" variant="outlined" />}
                  {e.delivery && <Chip label={`Delivery · ${e.delivery}`} size="small" variant="outlined" />}
                </Stack>
                <Box sx={{ display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 0.8, fontSize: 13, mb: 1.5 }}>
                  <Typography sx={{ color: "text.secondary", fontSize: 13, fontWeight: 600 }}>Phase</Typography>
                  <Typography sx={{ fontSize: 13 }}>{e.phaseName || "—"}</Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: 13, fontWeight: 600 }}>Next gate</Typography>
                  <Typography sx={{ fontSize: 13 }}>{e.nextGate || "—"}</Typography>
                  <Typography sx={{ color: "text.secondary", fontSize: 13, fontWeight: 600 }}>Stakeholders</Typography>
                  <Typography sx={{ fontSize: 13 }}>{e._count.stakeholders}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                  <Box sx={{ flex: 1, height: 8, background: "#F7FAFC", borderRadius: 1, overflow: "hidden" }}>
                    <Box sx={{ height: "100%", width: `${e.progress}%`, background: "linear-gradient(90deg,#38B2AC,#0E7C7B)" }} />
                  </Box>
                  <Typography sx={{ fontFamily: "JetBrains Mono, monospace", fontSize: 12, fontWeight: 700, minWidth: 40, textAlign: "right" }}>{e.progress}%</Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </AppShell>
  );
}
