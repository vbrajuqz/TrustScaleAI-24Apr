import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export async function requireAdminPage() {
  const session = await auth();
  if (!session) redirect("/signin?callbackUrl=/admin");
  if (session.user.role !== "PA") {
    return { ok: false as const };
  }
  return { ok: true as const, user: session.user };
}

export function NotAuthorized() {
  return (
    <Box sx={{ p: 6, textAlign: "center" }}>
      <Typography variant="h2" sx={{ color: "error.main", fontSize: 22, fontWeight: 800, mb: 2 }}>403 — Forbidden</Typography>
      <Typography sx={{ color: "text.secondary", mb: 1 }}>You do not have admin access.</Typography>
      <Typography sx={{ color: "text.secondary", fontSize: 13 }}>The Admin module is restricted to <code>balaramaraju.vatsavai@qualizeal.com</code> by default. Add additional Platform Administrators via Admin → Users.</Typography>
    </Box>
  );
}
