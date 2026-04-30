import Link from "next/link";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { auth, signOut } from "@/lib/auth";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

const NAV = [
  { href: "/dashboard",       label: "My engagements",  icon: "◆", key: "engagements" },
  { href: "/engagements/new", label: "New engagement",  icon: "+",      key: "new" },
];
const ADMIN_NAV = [
  { href: "/admin",                label: "Admin home",   icon: "⚙", key: "admin" },
  { href: "/admin/organizations",  label: "Organizations", icon: "▩", key: "admin-orgs" },
  { href: "/admin/users",          label: "Users",         icon: "⛭", key: "admin-users" },
  { href: "/admin/roles",          label: "Roles",         icon: "✴", key: "admin-roles" },
  { href: "/admin/variants",       label: "Variants",      icon: "⋮", key: "admin-variants" },
  { href: "/admin/templates",      label: "Templates (35)", icon: "☰", key: "admin-templates" },
];
const FOOTER_NAV = [
  { href: "/mockup.html", label: "Full mockup", icon: "▩", key: "mockup", external: true },
];

export default async function AppShell({ active, children }: { active?: string; children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user;
  const isAdmin = user?.role === "PA";

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "260px minmax(0,1fr)" }, minHeight: "100vh" }}>
      <Paper elevation={0} sx={{ display: { xs: "none", md: "block" }, borderRight: "1px solid #E2E8F0", p: "16px 14px", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <Box sx={{ display: "flex", gap: 1.2, alignItems: "center", pb: 1.5, mb: 1.5, borderBottom: "1px solid #E2E8F0", px: 0.5 }}>
          <Box sx={{ width: 32, height: 32, borderRadius: 1, background: "linear-gradient(135deg,#38B2AC,#0E7C7B)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>TS</Box>
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 800, fontFamily: "Manrope, sans-serif" }}>TrustScaleAI</Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>Companion Workspace</Typography>
          </Box>
        </Box>

        <NavSection title="Workspace" items={NAV} active={active} />
        {isAdmin && <NavSection title="Admin" items={ADMIN_NAV} active={active} />}
        <NavSection title="Help" items={FOOTER_NAV} active={active} />

        <Box sx={{ mt: 2, p: 1.5, background: "#E6FFFA", border: "1px solid #B2F5EA", borderRadius: 1 }}>
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#0E7C7B", letterSpacing: ".08em" }}>METHOD MENTOR</Typography>
          <Typography sx={{ fontSize: 12, mt: 0.5, color: "#1A365D" }}>
            Need guidance? Open the full mockup for the complete method view.
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ minWidth: 0 }}>
        <Paper elevation={0} sx={{ height: 56, borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", px: 2.5, gap: 1.5, position: "sticky", top: 0, zIndex: 5 }}>
          <Typography sx={{ flex: 1, fontSize: 13, color: "text.secondary" }}>
            <span>TrustScaleAI</span> &rsaquo; <b style={{ color: "#1A202C" }}>Companion</b>
          </Typography>
          {user && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar src={user.image ?? undefined} sx={{ width: 30, height: 30, fontSize: 12, bgcolor: "#38B2AC" }}>
                {(user.name || user.email || "?").slice(0, 1).toUpperCase()}
              </Avatar>
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{user.name || user.email}</Typography>
                <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                  {user.email} {isAdmin && <span style={{ color: "#0E7C7B", fontWeight: 700 }}>· Platform Admin</span>}
                </Typography>
              </Box>
              <form action={async () => { "use server"; await signOut({ redirectTo: "/signin" }); }}>
                <Button type="submit" size="small" variant="outlined">Sign out</Button>
              </form>
            </Box>
          )}
        </Paper>
        <Box component="main" sx={{ p: "24px 28px 60px", background: "#F7FAFC", minHeight: "calc(100vh - 56px)", minWidth: 0 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

function NavSection({ title, items, active }: { title: string; items: { href: string; label: string; icon: string; key: string; external?: boolean }[]; active?: string }) {
  return (
    <>
      <Typography sx={{ fontSize: 10.5, letterSpacing: ".1em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700, px: 1, pt: 1.5, pb: 0.5 }}>{title}</Typography>
      {items.map((n) => {
        const on = active === n.key;
        const inner = (
          <Box sx={{
            display: "flex", alignItems: "center", gap: 1.2, px: 1.2, py: 0.9,
            borderRadius: 1, fontSize: 12.8, fontWeight: on ? 700 : 500,
            color: on ? "#0E7C7B" : "#1A202C",
            background: on ? "#E6FFFA" : "transparent",
            "&:hover": { background: on ? "#E6FFFA" : "#EDF2F7" },
            cursor: "pointer",
          }}>
            <Box sx={{ width: 18, color: on ? "#0E7C7B" : "#718096", display: "inline-flex", justifyContent: "center" }}>{n.icon}</Box>
            <span>{n.label}</span>
          </Box>
        );
        return n.external
          ? <a key={n.key} href={n.href} target="_blank" rel="noopener noreferrer">{inner}</a>
          : <Link key={n.key} href={n.href}>{inner}</Link>;
      })}
    </>
  );
}
