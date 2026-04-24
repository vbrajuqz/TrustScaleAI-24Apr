"use client";
import { useFormState, useFormStatus } from "react-dom";
import { createEngagement, type EngagementFormState } from "@/lib/actions";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

const initial: EngagementFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="contained" color="primary" disabled={pending} size="large">
      {pending ? "Creating…" : "Create engagement"}
    </Button>
  );
}

export default function EngagementForm() {
  const [state, action] = useFormState(createEngagement, initial);
  const err = (k: string) => state.errors?.[k]?.[0];

  return (
    <Paper sx={{ p: 3, border: "1px solid #E2E8F0", maxWidth: 920 }}>
      {state.message && <Alert severity="error" sx={{ mb: 2 }}>{state.message}</Alert>}
      <form action={action}>
        <Typography sx={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700, mb: 1 }}>
          Basics
        </Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0,1fr))" }, mb: 3 }}>
          <TextField label="Engagement code" name="code" required helperText={err("code") || "e.g., ENG-2026-RB-003"} error={!!err("code")} fullWidth />
          <TextField label="Client" name="client" required helperText={err("client")} error={!!err("client")} fullWidth />
          <TextField label="Industry" name="industry" helperText="e.g., Banking, Pharma" fullWidth />
          <TextField select label="Variant" name="variant" defaultValue="Variant B · 4-Week Board-Ready" fullWidth>
            <MenuItem value="Variant A · 8-Week Full">Variant A · 8-Week Full</MenuItem>
            <MenuItem value="Variant B · 4-Week Board-Ready">Variant B · 4-Week Board-Ready</MenuItem>
            <MenuItem value="Variant C · Governance-only">Variant C · Governance-only</MenuItem>
            <MenuItem value="Variant D · Discovery-only">Variant D · Discovery-only</MenuItem>
          </TextField>
        </Box>

        <Typography sx={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700, mb: 1 }}>
          Method state
        </Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0,1fr))" }, mb: 3 }}>
          <TextField select label="Phase" name="phase" defaultValue={1} fullWidth>
            <MenuItem value={1}>P1 · Scope &amp; Frame</MenuItem>
            <MenuItem value={2}>P2 · Assess &amp; Diagnose</MenuItem>
            <MenuItem value={3}>P3 · Design &amp; Govern</MenuItem>
            <MenuItem value={4}>P4 · Execute &amp; Demonstrate</MenuItem>
          </TextField>
          <TextField label="Phase name" name="phaseName" defaultValue="Scope & Frame" fullWidth />
          <TextField select label="Next gate" name="nextGate" defaultValue="G1" fullWidth>
            <MenuItem value="G1">G1 · Scope</MenuItem>
            <MenuItem value="G2">G2 · Shortlist</MenuItem>
            <MenuItem value="G3">G3 · Evidence</MenuItem>
            <MenuItem value="G4">G4 · Decision</MenuItem>
          </TextField>
          <TextField select label="Status" name="status" defaultValue="In flight" fullWidth>
            <MenuItem value="In flight">In flight</MenuItem>
            <MenuItem value="On hold">On hold</MenuItem>
            <MenuItem value="Trial">Trial</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </TextField>
          <TextField label="Progress (%)" name="progress" type="number" inputProps={{ min: 0, max: 100 }} defaultValue={0} fullWidth />
          <TextField select label="Data region" name="region" defaultValue="EU-Central" fullWidth>
            <MenuItem value="EU-Central">EU-Central</MenuItem>
            <MenuItem value="EU-West">EU-West</MenuItem>
            <MenuItem value="US-East">US-East</MenuItem>
            <MenuItem value="APAC-SG">APAC-SG</MenuItem>
          </TextField>
        </Box>

        <Typography sx={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700, mb: 1 }}>
          Team &amp; dates
        </Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0,1fr))" }, mb: 3 }}>
          <TextField label="Client sponsor" name="sponsor" helperText="e.g., Sanne van Doorn" fullWidth />
          <TextField label="Delivery lead (QualiZeal)" name="delivery" helperText="e.g., Jan Smit" fullWidth />
          <TextField label="Start date" name="startDate" type="date" InputLabelProps={{ shrink: true }} fullWidth />
          <TextField label="Target date" name="targetDate" type="date" InputLabelProps={{ shrink: true }} fullWidth />
        </Box>

        <TextField label="Notes" name="notes" multiline rows={3} fullWidth sx={{ mb: 3 }} />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button component="a" href="/dashboard" variant="text">Cancel</Button>
          <SubmitButton />
        </Box>
      </form>
    </Paper>
  );
}
