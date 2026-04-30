import { requireAdminPage, NotAuthorized } from "./gate";
import AppShell from "@/components/AppShell";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const auth = await requireAdminPage();
  if (!auth.ok) return <AppShell active="admin"><NotAuthorized/></AppShell>;

  const [orgCount, userCount, engCount, roleCount, variantCount, templateCount] = await Promise.all([
    prisma.organization.count(),
    prisma.user.count(),
    prisma.engagement.count(),
    prisma.role.count(),
    prisma.engagementVariant.count(),
    prisma.methodTemplate.count(),
  ]);

  const tiles = [
    { label: "Organizations", val: orgCount, sub: "Clients + QualiZeal Platform", href: "/admin/organizations" },
    { label: "Users",         val: userCount, sub: "All identities provisioned",   href: "/admin/users" },
    { label: "Engagements",   val: engCount,  sub: "Across all organizations",     href: "/dashboard" },
    { label: "Method roles",  val: roleCount, sub: "Catalog · read-only",          href: "/admin/roles" },
    { label: "Variants",      val: variantCount, sub: "Catalog · PG §4.8/4.9/4.10", href: "/admin/variants" },
    { label: "Templates",     val: templateCount, sub: "Catalog · 12 Mar 2026 doc", href: "/admin/templates" },
  ];

  return (
    <AppShell active="admin">
      <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: 2, pb: 2, borderBottom: "1px solid #E2E8F0", flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>Admin</Typography>
          <Typography variant="h1">Master data &amp; platform settings</Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.5 }}>Organizations, users, and method catalogs. Restricted to Platform Administrators.</Typography>
        </Box>
        <Chip label="Platform Administrator" color="primary" sx={{ background:"#0E7C7B" }}/>
      </Box>

      <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0,1fr))", md: "repeat(3, minmax(0,1fr))" } }}>
        {tiles.map(t => (
          <Paper key={t.label} component={Link} href={t.href} sx={{ p: 2, border: "1px solid #E2E8F0", textDecoration: "none", color: "inherit", "&:hover": { borderColor: "#38B2AC", boxShadow: "0 4px 12px rgba(0,0,0,.06)" } }}>
            <Typography sx={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>{t.label}</Typography>
            <Typography sx={{ fontSize: 28, fontWeight: 800, fontFamily: "Manrope, sans-serif", mt: 0.5, color: "#0B2240" }}>{t.val}</Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{t.sub}</Typography>
          </Paper>
        ))}
      </Box>

      <Paper sx={{ p: 2.5, mt: 3, border: "1px solid #B2F5EA", background: "#E6FFFA" }}>
        <Typography sx={{ fontWeight: 700, fontSize: 13, color: "#0E7C7B", letterSpacing: ".08em" }}>BOOTSTRAPPED ADMIN</Typography>
        <Typography sx={{ mt: 1, fontSize: 14 }}><code>balaramaraju.vatsavai@qualizeal.com</code> is the seeded Platform Administrator. Promote additional users via <Link href="/admin/users">Users</Link>.</Typography>
      </Paper>

      <Paper sx={{ p: 2.5, mt: 2, border: "1px solid #E2E8F0" }}>
        <Typography variant="h3" sx={{ mb: 1 }}>Quick actions</Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button component={Link} href="/admin/organizations/new" variant="contained">+ New organization</Button>
          <Button component={Link} href="/admin/users/new" variant="outlined">+ Invite user</Button>
          <Button component={Link} href="/engagements/new" variant="outlined">+ New engagement</Button>
        </Box>
      </Paper>
    </AppShell>
  );
}
