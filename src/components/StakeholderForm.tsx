"use client";
import { useFormState, useFormStatus } from "react-dom";
import { addStakeholder, type StakeholderFormState } from "@/lib/actions";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

const initial: StakeholderFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="contained" color="primary" disabled={pending}>
      {pending ? "Adding…" : "Add stakeholder"}
    </Button>
  );
}

export default function StakeholderForm({ engagementId }: { engagementId: string }) {
  const [state, action] = useFormState(addStakeholder, initial);
  const err = (k: string) => state.errors?.[k]?.[0];
  return (
    <form action={action}>
      <input type="hidden" name="engagementId" value={engagementId} />
      {state.message && <Alert severity="error" sx={{ mb: 2 }}>{state.message}</Alert>}
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0,1fr))" } }}>
        <TextField label="Full name" name="fullName" required error={!!err("fullName")} helperText={err("fullName")} fullWidth />
        <TextField label="Email" name="email" type="email" required error={!!err("email")} helperText={err("email")} fullWidth />
        <TextField label="Organization" name="organization" required error={!!err("organization")} helperText={err("organization")} defaultValue="" fullWidth />
        <TextField label="Role" name="role" required error={!!err("role")} helperText={err("role") || "e.g., Executive Sponsor, CISO"} fullWidth />
        <TextField select label="Side" name="side" defaultValue="Client" fullWidth>
          <MenuItem value="Client">Client</MenuItem>
          <MenuItem value="Delivery">Delivery (QualiZeal)</MenuItem>
          <MenuItem value="Observer">Observer</MenuItem>
        </TextField>
        <TextField label="Phone" name="phone" fullWidth />
        <TextField select label="Influence" name="influence" defaultValue="High" fullWidth>
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
        </TextField>
        <TextField select label="Interest" name="interest" defaultValue="High" fullWidth>
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
        </TextField>
        <TextField sx={{ gridColumn: "1 / -1" }} label="Notes" name="notes" multiline rows={2} fullWidth />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
        <SubmitButton />
      </Box>
    </form>
  );
}
