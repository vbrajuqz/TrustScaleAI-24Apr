import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import AppShell from "@/components/AppShell";
import StakeholderForm from "@/components/StakeholderForm";
import VFRPanel from "@/components/VFRPanel";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { params: { id: string }; searchParams?: { added?: string } };

export default async function EngagementDetailPage({ params, searchParams }: Props) {
  const eng = await prisma.engagement.findUnique({
    where: { id: params.id },
    include: {
      stakeholders: { orderBy: { createdAt: "desc" } },
      organization: true,
      variant: true,
      sponsorUser: true,
      deliveryLeadUser: true,
      vfrWeight: true,
      team: { include: { user: true } },
    },
  });
  if (!eng) return notFound();

  return (
    <AppShell active="engagements">
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: 2, pb: 2, borderBottom: "1px solid #E2E8F0", gap: 2, flexWrap: "wrap" }}>
        <Box>
          <Typography sx={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>Engagement</Typography>
          <Typography variant="h1">{eng.client}</Typography>
          <Typography sx={{ fontFamily: "JetBrains Mono, monospace", fontSize: 13, color: "text.secondary", mt: 0.5 }}>{eng.code} · {eng.variant.label}</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button component={Link} href="/dashboard" variant="outlined">Back</Button>
          <Button component="a" href="/mockup.html" target="_blank" rel="noopener noreferrer" variant="contained" color="secondary">Open full workspace →</Button>
        </Box>
      </Box>

      {searchParams?.added === "1" && <Alert severity="success" sx={{ mb: 2 }}>Stakeholder added.</Alert>}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0,1fr) 420px" }, gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2.5, border: "1px solid #E2E8F0" }}>
          <Typography variant="h3" sx={{ mb: 1.5 }}>Summary</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "180px 1fr", rowGap: 1, fontSize: 13 }}>
            <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>Organization</Typography><Typography>{eng.organization.name} <Chip size="small" label={eng.organization.type} sx={{ ml: 0.5 }}/></Typography>
            <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>Industry</Typography><Typography>{eng.industry || "—"}</Typography>
            <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>Variant</Typography><Typography>{eng.variant.label} ({eng.variant.durationWeeks}w)</Typography>
            <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>Phase</Typography><Typography>P{eng.phase} · {eng.phaseName || "—"}</Typography>
            <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>Next gate</Typography><Typography>{eng.nextGate || "—"}</Typography>
            <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>Status</Typography><Typography><Chip size="small" label={eng.status} color={eng.status === "Closed" ? "default" : eng.status.includes("hold") ? "warning" : "success"}/></Typography>
            <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>Sponsor</Typography><Typography>{eng.sponsorUser?.name} <span style={{color:"#718096"}}>· {eng.sponsorUser?.email}</span></Typography>
            <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>Delivery lead</Typography><Typography>{eng.deliveryLeadUser?.name} <span style={{color:"#718096"}}>· {eng.deliveryLeadUser?.email}</span></Typography>
            <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>Region</Typography><Typography>{eng.region}</Typography>
            <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>Dates</Typography><Typography>{eng.startDate?.toISOString().slice(0,10) || "—"} → {eng.targetDate?.toISOString().slice(0,10) || "—"}</Typography>
          </Box>
          {eng.notes && <><Divider sx={{ my: 2 }}/><Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 600, mb: 0.5 }}>Notes</Typography><Typography sx={{ fontSize: 13, whiteSpace: "pre-wrap" }}>{eng.notes}</Typography></>}
        </Paper>

        {eng.vfrWeight && <VFRPanel weight={eng.vfrWeight}/>}
      </Box>

      <Paper sx={{ p: 2.5, border: "1px solid #E2E8F0", mb: 3 }}>
        <Typography variant="h3" sx={{ mb: 1.5 }}>Add stakeholder</Typography>
        <Typography sx={{ color: "text.secondary", fontSize: 12, mb: 2 }}>Per data model entity #10. Function uses the documented enum (Risk / Compliance / Operations / Data / IT / Finance / Business).</Typography>
        <StakeholderForm engagementId={eng.id} orgName={eng.organization.name}/>
      </Paper>

      <Paper sx={{ p: 0, border: "1px solid #E2E8F0" }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h3">Stakeholders ({eng.stakeholders.length})</Typography>
        </Box>
        {eng.stakeholders.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>No stakeholders yet. Add the first using the form above.</Box>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <Box component="thead">
                <Box component="tr">
                  {["Name","Role","Org","Function","Side","Influence","Interest","Risk","Data owner","Email"].map(h => (
                    <Box component="th" key={h} sx={{ textAlign: "left", p: "8px 10px", fontSize: 11, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", background: "#F7FAFC", borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>{h}</Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {eng.stakeholders.map(s => (
                  <Box component="tr" key={s.id} sx={{ borderBottom: "1px solid #EDF2F7" }}>
                    <Box component="td" sx={{ p: "8px 10px", fontWeight: 600 }}>{s.fullName}</Box>
                    <Box component="td" sx={{ p: "8px 10px" }}>{s.role}</Box>
                    <Box component="td" sx={{ p: "8px 10px" }}>{s.organization}</Box>
                    <Box component="td" sx={{ p: "8px 10px" }}><Chip size="small" label={s.function}/></Box>
                    <Box component="td" sx={{ p: "8px 10px" }}><Chip size="small" label={s.side} variant="outlined"/></Box>
                    <Box component="td" sx={{ p: "8px 10px" }}><Chip size="small" label={s.influence} color={s.influence==="High"?"error":s.influence==="Medium"?"warning":"default"}/></Box>
                    <Box component="td" sx={{ p: "8px 10px" }}><Chip size="small" label={s.interest} variant="outlined"/></Box>
                    <Box component="td" sx={{ p: "8px 10px" }}><Chip size="small" label={s.riskLevel} color={s.riskLevel==="High"?"error":s.riskLevel==="Medium"?"warning":"success"}/></Box>
                    <Box component="td" sx={{ p: "8px 10px" }}>{s.dataOwner ? <Chip size="small" label="Yes" color="primary"/> : <span style={{color:"#A0AEC0"}}>—</span>}</Box>
                    <Box component="td" sx={{ p: "8px 10px", fontFamily: "JetBrains Mono, monospace", fontSize: 11.5, color: "text.secondary" }}>{s.email}</Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </AppShell>
  );
}
