import { requireAdminPage, NotAuthorized } from "../../gate";
import AppShell from "@/components/AppShell";
import OrgForm from "@/components/OrgForm";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default async function NewOrg() {
  const a = await requireAdminPage();
  if (!a.ok) return <AppShell active="admin-orgs"><NotAuthorized/></AppShell>;
  return (
    <AppShell active="admin-orgs">
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>Admin · New</Typography>
        <Typography variant="h1">Provision organization</Typography>
        <Typography sx={{ color: "text.secondary", mt: 0.5 }}>Create a new tenant. Domain is unique and is used for SSO auto-match.</Typography>
      </Box>
      <OrgForm/>
    </AppShell>
  );
}
