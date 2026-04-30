import { requireAdminPage, NotAuthorized } from "../gate";
import AppShell from "@/components/AppShell";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";

export const dynamic = "force-dynamic";

export default async function OrgList() {
  const a = await requireAdminPage();
  if (!a.ok) return <AppShell active="admin-orgs"><NotAuthorized/></AppShell>;
  const rows = await prisma.organization.findMany({ orderBy: [{ type: "asc" }, { name: "asc" }], include: { _count: { select: { users: true, engagements: true } } } });
  return (
    <AppShell active="admin-orgs">
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: 2, pb: 2, borderBottom: "1px solid #E2E8F0", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>Admin · Master data</Typography>
          <Typography variant="h1">Organizations</Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.5 }}>Tenant directory — Platform (QualiZeal) and Clients/Partners.</Typography>
        </Box>
        <Button component={Link} href="/admin/organizations/new" variant="contained">+ New organization</Button>
      </Box>
      <Paper sx={{ border: "1px solid #E2E8F0", overflowX: "auto" }}>
        <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <Box component="thead">
            <Box component="tr">
              {["Name","Type","Domain","Plan","Status","Region","Seats","Users","Engagements",""].map(h => (
                <Box component="th" key={h} sx={{ textAlign: "left", p: "10px 12px", fontSize: 11, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", background: "#F7FAFC", borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>{h}</Box>
              ))}
            </Box>
          </Box>
          <Box component="tbody">
            {rows.map(r => (
              <Box component="tr" key={r.id} sx={{ borderBottom: "1px solid #EDF2F7" }}>
                <Box component="td" sx={{ p: "10px 12px", fontWeight: 600 }}>{r.name}</Box>
                <Box component="td" sx={{ p: "10px 12px" }}><Chip size="small" label={r.type} color={r.type === "Platform" ? "primary" : "default"}/></Box>
                <Box component="td" sx={{ p: "10px 12px", fontFamily: "JetBrains Mono, monospace", fontSize: 11.5, color: "text.secondary" }}>{r.domain}</Box>
                <Box component="td" sx={{ p: "10px 12px" }}><Chip size="small" label={r.plan}/></Box>
                <Box component="td" sx={{ p: "10px 12px" }}>
                  <Chip size="small" label={r.status} color={r.status === "Active" ? "success" : r.status === "Trial" ? "info" : r.status === "Suspended" ? "error" : "warning"}/>
                </Box>
                <Box component="td" sx={{ p: "10px 12px" }}>{r.region}</Box>
                <Box component="td" sx={{ p: "10px 12px", fontFamily: "JetBrains Mono, monospace" }}>{r.seats}</Box>
                <Box component="td" sx={{ p: "10px 12px", fontFamily: "JetBrains Mono, monospace" }}>{r._count.users}</Box>
                <Box component="td" sx={{ p: "10px 12px", fontFamily: "JetBrains Mono, monospace" }}>{r._count.engagements}</Box>
                <Box component="td" sx={{ p: "10px 12px" }}>
                  <Button component={Link} href={`/admin/organizations/${r.id}`} size="small" variant="outlined">Edit</Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </AppShell>
  );
}
