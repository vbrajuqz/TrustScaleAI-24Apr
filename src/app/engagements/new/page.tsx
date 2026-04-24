import AppShell from "@/components/AppShell";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EngagementForm from "@/components/EngagementForm";

export default function NewEngagementPage() {
  return (
    <AppShell active="new">
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700 }}>
          New
        </Typography>
        <Typography variant="h1">Create engagement</Typography>
        <Typography sx={{ color: "text.secondary", mt: 0.5, maxWidth: 760 }}>
          Provision a new TrustScaleAI engagement. You can add stakeholders once the engagement exists.
        </Typography>
      </Box>
      <EngagementForm />
    </AppShell>
  );
}
