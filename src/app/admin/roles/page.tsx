import { requireAdminPage, NotAuthorized } from "../gate";
import AppShell from "@/components/AppShell";
import prisma from "@/lib/prisma";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

export default async function RolesCatalog() {
  const a = await requireAdminPage();
  if (!a.ok) return <AppShell active="admin-roles"><NotAuthorized/></AppShell>;
  const rows = await prisma.role.findMany({ orderBy: { code: "asc" } });
  return (
    <AppShell active="admin-roles">
      <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid #E2E8F0" }}>
        <Typography sx={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>Admin · Catalog</Typography>
        <Typography variant="h1">Roles ({rows.length})</Typography>
        <Typography sx={{ color: "text.secondary", mt: 0.5 }}>Method-defined catalog. Source: <i>TrustScaleAI Participant Guide, Chapter 6</i>. Read-only.</Typography>
      </Box>
      <Paper sx={{ border: "1px solid #E2E8F0", overflowX: "auto" }}>
        <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <Box component="thead">
            <Box component="tr">
              {["Code","Name","Scope","Description","Permissions"].map(h => (
                <Box component="th" key={h} sx={{ textAlign: "left", p: "10px 12px", fontSize: 11, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", background: "#F7FAFC", borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>{h}</Box>
              ))}
            </Box>
          </Box>
          <Box component="tbody">
            {rows.map(r => (
              <Box component="tr" key={r.code} sx={{ borderBottom: "1px solid #EDF2F7", verticalAlign: "top" }}>
                <Box component="td" sx={{ p: "10px 12px", fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>{r.code}</Box>
                <Box component="td" sx={{ p: "10px 12px", fontWeight: 600 }}>{r.name}</Box>
                <Box component="td" sx={{ p: "10px 12px" }}><Chip size="small" label={r.orgScope}/></Box>
                <Box component="td" sx={{ p: "10px 12px", fontSize: 12.5, color: "text.secondary", maxWidth: 460 }}>{r.description}</Box>
                <Box component="td" sx={{ p: "10px 12px", fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "#0E7C7B" }}>{r.permissions.join(", ")}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </AppShell>
  );
}
