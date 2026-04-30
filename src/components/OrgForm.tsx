"use client";
import { useFormState, useFormStatus } from "react-dom";
import { createOrganization, updateOrganization, type OrgState } from "@/lib/admin-actions";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

const initial: OrgState = {};

function Submit({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return <Button type="submit" variant="contained" disabled={pending} size="large">{pending ? "Saving…" : editing ? "Save changes" : "Provision organization"}</Button>;
}

type Org = {
  id: string; name: string; type: string; domain: string;
  plan: string; status: string; region: string; seats: number;
};

export default function OrgForm({ initial: org }: { initial?: Org }) {
  const action = org
    ? async (_prev: OrgState, fd: FormData) => updateOrganization(org.id, fd)
    : createOrganization;
  const [state, doAction] = useFormState<OrgState, FormData>(action, initial);
  const err = (k: string) => state.errors?.[k]?.[0];

  return (
    <Paper sx={{ p: 3, border: "1px solid #E2E8F0", maxWidth: 920 }}>
      {state.message && state.errors && <Alert severity="error" sx={{ mb: 2 }}>{state.message}</Alert>}
      {state.message && !state.errors && <Alert severity="success" sx={{ mb: 2 }}>{state.message}</Alert>}
      <form action={doAction}>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0,1fr))" } }}>
          <TextField label="Organization name" name="name" required defaultValue={org?.name||""} error={!!err("name")} helperText={err("name")} fullWidth/>
          <TextField select label="Type" name="type" defaultValue={org?.type||"Client"} required fullWidth>
            <MenuItem value="Platform">Platform</MenuItem>
            <MenuItem value="Client">Client</MenuItem>
            <MenuItem value="Partner">Partner</MenuItem>
          </TextField>
          <TextField label="Primary domain" name="domain" required defaultValue={org?.domain||""} error={!!err("domain")} helperText={err("domain") || "e.g. regiobank.nl — used for SSO auto-match"} fullWidth/>
          <TextField label="Seats purchased" name="seats" type="number" inputProps={{ min: 1 }} defaultValue={org?.seats ?? 20} required fullWidth/>
          <TextField select label="Plan" name="plan" defaultValue={org?.plan||"Advisory"} required fullWidth>
            <MenuItem value="Trial">Trial</MenuItem>
            <MenuItem value="Advisory">Advisory</MenuItem>
            <MenuItem value="Enterprise">Enterprise</MenuItem>
          </TextField>
          <TextField select label="Status" name="status" defaultValue={org?.status||"Provisioning"} required fullWidth>
            <MenuItem value="Provisioning">Provisioning</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Trial">Trial</MenuItem>
            <MenuItem value="Suspended">Suspended</MenuItem>
          </TextField>
          <TextField select label="Data region" name="region" defaultValue={org?.region||"EU-Central"} required fullWidth>
            <MenuItem value="EU-Central">EU-Central</MenuItem>
            <MenuItem value="EU-West">EU-West</MenuItem>
            <MenuItem value="US-East">US-East</MenuItem>
            <MenuItem value="APAC-SG">APAC-SG</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
          <Button component="a" href="/admin/organizations" variant="text">Cancel</Button>
          <Submit editing={!!org}/>
        </Box>
      </form>
    </Paper>
  );
}
