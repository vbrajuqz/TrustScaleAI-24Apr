"use client";
import { useFormState, useFormStatus } from "react-dom";
import { createUser, type UserState } from "@/lib/admin-actions";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

const initial: UserState = {};

type Org = { id: string; name: string; type: string };
type Role = { code: string; name: string };

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" variant="contained" disabled={pending} size="large">{pending ? "Inviting…" : "Invite user"}</Button>;
}

export default function UserForm({ orgs, roles }: { orgs: Org[]; roles: Role[] }) {
  const [state, action] = useFormState(createUser, initial);
  const err = (k: string) => state.errors?.[k]?.[0];
  return (
    <Paper sx={{ p: 3, border: "1px solid #E2E8F0", maxWidth: 720 }}>
      {state.message && <Alert severity="error" sx={{ mb: 2 }}>{state.message}</Alert>}
      <form action={action}>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0,1fr))" } }}>
          <TextField label="Full name" name="name" required defaultValue="" error={!!err("name")} helperText={err("name")}/>
          <TextField label="Email" name="email" type="email" required defaultValue="" error={!!err("email")} helperText={err("email") || "Lower-cased on save"}/>
          <TextField select label="Organization" name="organizationId" required defaultValue="">
            {orgs.map(o => <MenuItem key={o.id} value={o.id}>{o.name} <span style={{color:"#718096", marginLeft:6}}>· {o.type}</span></MenuItem>)}
          </TextField>
          <TextField select label="Platform role" name="platformRoleCode" required defaultValue="ST">
            {roles.map(r => <MenuItem key={r.code} value={r.code}>{r.code} · {r.name}</MenuItem>)}
          </TextField>
          <TextField select label="Status" name="status" required defaultValue="Invited">
            <MenuItem value="Invited">Invited</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Deactivated">Deactivated</MenuItem>
          </TextField>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}>
          <Button component="a" href="/admin/users" variant="text">Cancel</Button>
          <Submit/>
        </Box>
      </form>
    </Paper>
  );
}
