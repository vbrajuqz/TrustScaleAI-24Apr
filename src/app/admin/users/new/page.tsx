import { requireAdminPage, NotAuthorized } from "../../gate";
import AppShell from "@/components/AppShell";
import prisma from "@/lib/prisma";
import UserForm from "@/components/UserForm";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default async function NewUser() {
  const a = await requireAdminPage();
  if (!a.ok) return <AppShell active="admin-users"><NotAuthorized/></AppShell>;
  const [orgs, roles] = await Promise.all([
    prisma.organization.findMany({ orderBy: { name: "asc" } }),
    prisma.role.findMany({ orderBy: { code: "asc" } }),
  ]);
  return (
    <AppShell active="admin-users">
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>Admin · New</Typography>
        <Typography variant="h1">Invite user</Typography>
        <Typography sx={{ color: "text.secondary", mt: 0.5 }}>Pre-provision a user record. The user will sign in via Microsoft or Google SSO using their email.</Typography>
      </Box>
      <UserForm orgs={orgs} roles={roles}/>
    </AppShell>
  );
}
