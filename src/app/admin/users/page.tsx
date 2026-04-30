import { requireAdminPage, NotAuthorized } from "../gate";
import AppShell from "@/components/AppShell";
import prisma from "@/lib/prisma";
import Link from "next/link";
import UserRoleSelect from "@/components/UserRoleSelect";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";

export const dynamic = "force-dynamic";

export default async function UsersList() {
  const a = await requireAdminPage();
  if (!a.ok) return <AppShell active="admin-users"><NotAuthorized/></AppShell>;
  const [rows, roles] = await Promise.all([
    prisma.user.findMany({ include: { organization: true }, orderBy: [{ platformRoleCode: "asc" }, { name: "asc" }] }),
    prisma.role.findMany({ orderBy: { code: "asc" } }),
  ]);
  return (
    <AppShell active="admin-users">
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: 2, pb: 2, borderBottom: "1px solid #E2E8F0", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>Admin · Master data</Typography>
          <Typography variant="h1">Users</Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.5 }}>Identities authorized for the platform. Role changes apply immediately.</Typography>
        </Box>
        <Button component={Link} href="/admin/users/new" variant="contained">+ Invite user</Button>
      </Box>
      <Paper sx={{ border: "1px solid #E2E8F0", overflowX: "auto" }}>
        <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <Box component="thead">
            <Box component="tr">
              {["Name","Email","Organization","Role","Status","Last login"].map(h => (
                <Box component="th" key={h} sx={{ textAlign: "left", p: "10px 12px", fontSize: 11, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", background: "#F7FAFC", borderBottom: "1px solid #E2E8F0", whiteSpace: "nowrap" }}>{h}</Box>
              ))}
            </Box>
          </Box>
          <Box component="tbody">
            {rows.map(u => (
              <Box component="tr" key={u.id} sx={{ borderBottom: "1px solid #EDF2F7" }}>
                <Box component="td" sx={{ p: "10px 12px", fontWeight: 600 }}>{u.name || "—"}</Box>
                <Box component="td" sx={{ p: "10px 12px", fontFamily: "JetBrains Mono, monospace", fontSize: 11.5 }}>{u.email}</Box>
                <Box component="td" sx={{ p: "10px 12px" }}>{u.organization?.name || <span style={{color:"#A0AEC0"}}>—</span>}</Box>
                <Box component="td" sx={{ p: "10px 12px" }}>
                  <UserRoleSelect userId={u.id} value={u.platformRoleCode} roles={roles}/>
                </Box>
                <Box component="td" sx={{ p: "10px 12px" }}><Chip size="small" label={u.status} color={u.status==="Active"?"success":u.status==="Invited"?"info":"default"}/></Box>
                <Box component="td" sx={{ p: "10px 12px", fontFamily: "JetBrains Mono, monospace", fontSize: 11, color: "text.secondary" }}>{u.lastLogin ? u.lastLogin.toISOString().slice(0,16).replace("T"," ") : "—"}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </AppShell>
  );
}
