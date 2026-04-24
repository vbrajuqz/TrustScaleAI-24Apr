import { signIn } from "@/lib/auth";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

type SP = { searchParams?: { callbackUrl?: string; error?: string } };

export default async function SignInPage({ searchParams }: SP) {
  const session = await auth();
  if (session) redirect(searchParams?.callbackUrl || "/dashboard");
  const error = searchParams?.error;
  const callbackUrl = searchParams?.callbackUrl || "/dashboard";

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
      {/* Left — hero */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          p: 6,
          color: "#fff",
          background: "linear-gradient(155deg, #0B2240 0%, #1A365D 50%, #234E52 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, fontWeight: 800, fontSize: 20 }}>
          <Box sx={{ width: 36, height: 36, borderRadius: "8px", background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Manrope" }}>
            TS
          </Box>
          TrustScaleAI
        </Box>
        <Box>
          <Typography sx={{ fontFamily: "Manrope", fontWeight: 800, fontSize: 36, lineHeight: 1.15, mb: 1.5 }}>
            The companion platform for the NexaAI method.
          </Typography>
          <Typography sx={{ color: "#CBD5E0", maxWidth: 440 }}>
            4 phases &middot; 4 gates &middot; 35 templates &middot; 8 readiness dimensions &middot; 5 method outputs. Board-ready evidence in a single traceable workspace.
          </Typography>
          <Stack spacing={1.2} sx={{ mt: 3, color: "#CBD5E0", fontSize: 14 }}>
            <span><b style={{ color: "#fff" }}>Scope &amp; Frame</b> &middot; T-A1 through T-A5</span>
            <span><b style={{ color: "#fff" }}>Assess &amp; Diagnose</b> &middot; AI Value Ledger, 8-dim readiness</span>
            <span><b style={{ color: "#fff" }}>Design &amp; Govern</b> &middot; Policy, RACI, EvalOps</span>
            <span><b style={{ color: "#fff" }}>Execute &amp; Demonstrate</b> &middot; Exec pack &amp; Roadmap</span>
          </Stack>
        </Box>
        <Typography sx={{ color: "rgba(255,255,255,.5)", fontSize: 12 }}>&copy; QualiZeal &middot; TrustScaleAI</Typography>
      </Box>

      {/* Right — card */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 4 }}>
        <Paper sx={{ p: 5, width: "100%", maxWidth: 460, borderRadius: 2, border: "1px solid #E2E8F0" }}>
          <Typography variant="h2" sx={{ fontSize: 24, mb: 0.5 }}>Sign in</Typography>
          <Typography sx={{ color: "text.secondary", mb: 3 }}>
            Welcome back. Sign in to your Organization using your work identity.
          </Typography>

          {error && (
            <Box sx={{ p: 1.5, mb: 2, borderRadius: 1, background: "#FED7D7", color: "#742A2A", fontSize: 13 }}>
              Sign-in failed ({error}). Please try again or contact support.
            </Box>
          )}

          <Stack spacing={1.5}>
            <form
              action={async () => {
                "use server";
                await signIn("microsoft-entra-id", { redirectTo: callbackUrl });
              }}
            >
              <Button type="submit" fullWidth size="large" variant="outlined" sx={{ justifyContent: "flex-start", borderColor: "#E2E8F0", color: "text.primary", py: 1.3 }}>
                <Box sx={{ mr: 1.5, display: "inline-flex" }}>
                  <svg width="18" height="18" viewBox="0 0 23 23" aria-hidden>
                    <rect x="1" y="1" width="10" height="10" fill="#F25022" />
                    <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
                    <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
                    <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
                  </svg>
                </Box>
                Continue with Microsoft
              </Button>
            </form>

            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: callbackUrl });
              }}
            >
              <Button type="submit" fullWidth size="large" variant="outlined" sx={{ justifyContent: "flex-start", borderColor: "#E2E8F0", color: "text.primary", py: 1.3 }}>
                <Box sx={{ mr: 1.5, display: "inline-flex" }}>
                  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                </Box>
                Continue with Google
              </Button>
            </form>
          </Stack>

          <Divider sx={{ my: 3, fontSize: 12, color: "text.secondary" }}>or preview the mockup</Divider>

          <Button fullWidth variant="text" color="secondary" component="a" href="/mockup.html">
            Open full product mockup &rarr;
          </Button>

          <Typography sx={{ mt: 3, fontSize: 12.5, color: "text.secondary", textAlign: "center" }}>
            Protected by Microsoft Entra ID &amp; Google OAuth. Your session is stored securely.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
