import { requireAdminPage, NotAuthorized } from "../gate";
import AppShell from "@/components/AppShell";
import prisma from "@/lib/prisma";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";

const FOLDER_NAMES: Record<string,string> = {
  A: "Discovery", B: "Use Case", C: "Value", D: "Readiness",
  E: "Governance", F: "Exec Pack & Handoff", G: "Internal QA",
};

export default async function TemplatesCatalog() {
  const a = await requireAdminPage();
  if (!a.ok) return <AppShell active="admin-templates"><NotAuthorized/></AppShell>;
  const rows = await prisma.methodTemplate.findMany({ orderBy: { code: "asc" } });
  const byFolder: Record<string, typeof rows> = {};
  rows.forEach(r => { (byFolder[r.folder] ??= []).push(r); });
  return (
    <AppShell active="admin-templates">
      <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid #E2E8F0" }}>
        <Typography sx={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>Admin · Catalog</Typography>
        <Typography variant="h1">Method Templates ({rows.length})</Typography>
        <Typography sx={{ color: "text.secondary", mt: 0.5 }}>Source: <i>TrustScaleAI Templates — 12 Mar 2026</i>. Names are verbatim. Read-only.</Typography>
      </Box>
      {Object.entries(byFolder).map(([folder, items]) => (
        <Paper key={folder} sx={{ p: 0, border: "1px solid #E2E8F0", mb: 2 }}>
          <Box sx={{ p: 1.5, background: "#F7FAFC", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h3">Folder {folder} · {FOLDER_NAMES[folder]}</Typography>
            <Chip size="small" label={`${items.length} templates`}/>
          </Box>
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <Box component="thead">
              <Box component="tr">
                {["Code","Title","Phase","Purpose"].map(h => (
                  <Box component="th" key={h} sx={{ textAlign: "left", p: "8px 12px", fontSize: 11, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", background: "#F7FAFC", borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>{h}</Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              {items.map(t => (
                <Box component="tr" key={t.code} sx={{ borderBottom: "1px solid #EDF2F7" }}>
                  <Box component="td" sx={{ p: "8px 12px", fontFamily: "JetBrains Mono, monospace", fontWeight: 700 }}>{t.code}</Box>
                  <Box component="td" sx={{ p: "8px 12px", fontWeight: 600 }}>{t.title}</Box>
                  <Box component="td" sx={{ p: "8px 12px" }}><Chip size="small" label={t.phase===0?"All":`P${t.phase}`}/></Box>
                  <Box component="td" sx={{ p: "8px 12px", color: "text.secondary" }}>{t.purpose}</Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
      ))}
    </AppShell>
  );
}
