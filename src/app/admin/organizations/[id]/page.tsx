import { requireAdminPage, NotAuthorized } from "../../gate";
import AppShell from "@/components/AppShell";
import prisma from "@/lib/prisma";
import OrgForm from "@/components/OrgForm";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default async function EditOrg({ params }: { params: { id: string } }) {
  const a = await requireAdminPage();
  if (!a.ok) return <AppShell active="admin-orgs"><NotAuthorized/></AppShell>;
  const org = await prisma.organization.findUnique({ where: { id: params.id } });
  if (!org) return notFound();
  return (
    <AppShell active="admin-orgs">
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>Admin · Edit</Typography>
        <Typography variant="h1">{org.name}</Typography>
        <Typography sx={{ color: "text.secondary", mt: 0.5 }}>{org.type} · {org.domain}</Typography>
      </Box>
      <OrgForm initial={org}/>
    </AppShell>
  );
}
