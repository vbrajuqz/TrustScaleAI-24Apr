import { requireAdminPage, NotAuthorized } from "../gate";
import AppShell from "@/components/AppShell";
import prisma from "@/lib/prisma";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

export default async function VariantsCatalog() {
  const a = await requireAdminPage();
  if (!a.ok) return <AppShell active="admin-variants"><NotAuthorized/></AppShell>;
  const rows = await prisma.engagementVariant.findMany({ orderBy: { code: "asc" } });
  return (
    <AppShell active="admin-variants">
      <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid #E2E8F0" }}>
        <Typography sx={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>Admin · Catalog</Typography>
        <Typography variant="h1">Engagement Variants ({rows.length})</Typography>
        <Typography sx={{ color: "text.secondary", mt: 0.5 }}>Method paths. Source: <i>Participant Guide §4.8 / §4.9 / §4.10</i>. Read-only.</Typography>
      </Box>
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0,1fr))" } }}>
        {rows.map(v => (
          <Paper key={v.code} sx={{ p: 2.5, border: "1px solid #E2E8F0" }}>
            <Chip label={`${v.code} · ${v.durationWeeks}-Week`} sx={{ background: "#0B2240", color: "#fff", mb: 1 }}/>
            <Typography variant="h3" sx={{ mb: 1 }}>{v.label}</Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 13, mb: 1.5 }}>{v.description}</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", mt: 1 }}>Templates ({v.templateCodes.length})</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
              {v.templateCodes.map(c => <Chip key={c} size="small" label={c} sx={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10.5 }}/>)}
            </Box>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", mt: 2 }}>Gates ({v.gateCodes.length})</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
              {v.gateCodes.map(g => <Chip key={g} size="small" label={g} sx={{ background:"#E6FFFA", color:"#0E7C7B" }}/>)}
            </Box>
          </Paper>
        ))}
      </Box>
    </AppShell>
  );
}
