"use client";
import { useFormState, useFormStatus } from "react-dom";
import { addStakeholder, type StakeholderFormState } from "@/lib/actions";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

const initial: StakeholderFormState = {};

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" variant="contained" disabled={pending}>{pending ? "Adding…" : "Add stakeholder"}</Button>;
}

const FUNCTIONS = ["Risk","Compliance","Operations","Data","IT","Finance","Business"];
const ROLE_HINTS = ["Executive Sponsor","CISO","CRO","COO","CFO","Operations Lead","Data Owner","Compliance Lead","Legal","Privacy Officer"];

export default function StakeholderForm({ engagementId, orgName }: { engagementId: string; orgName?: string }) {
  const [state, action] = useFormState(addStakeholder, initial);
  const err = (k: string) => state.errors?.[k]?.[0];

  return (
    <form action={action}>
      <input type="hidden" name="engagementId" value={engagementId}/>
      {state.message && <Alert severity="error" sx={{ mb: 2 }}>{state.message}</Alert>}

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0,1fr))" } }}>
        <TextField label="Full name" name="fullName" required defaultValue=""
          error={!!err("fullName")} helperText={err("fullName")}/>
        <TextField label="Email" name="email" type="email" required defaultValue=""
          error={!!err("email")} helperText={err("email")}/>
        <TextField label="Phone" name="phone" defaultValue="" helperText="Optional"/>
        <TextField label="Organization" name="organization" required defaultValue={orgName || ""}
          error={!!err("organization")} helperText={err("organization") || "Defaults to engagement client"}/>
        <TextField label="Role / title" name="role" required defaultValue=""
          error={!!err("role")} helperText={err("role") || `e.g. ${ROLE_HINTS.slice(0,3).join(", ")}`}/>
        <TextField select label="Function" name="function" required defaultValue="Operations"
          error={!!err("function")} helperText={err("function") || "Org function area"}>
          {FUNCTIONS.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
        </TextField>
        <TextField select label="Influence" name="influence" defaultValue="High" helperText="Decision power">
          <MenuItem value="High">High</MenuItem><MenuItem value="Medium">Medium</MenuItem><MenuItem value="Low">Low</MenuItem>
        </TextField>
        <TextField select label="Interest" name="interest" defaultValue="High" helperText="Engagement appetite">
          <MenuItem value="High">High</MenuItem><MenuItem value="Medium">Medium</MenuItem><MenuItem value="Low">Low</MenuItem>
        </TextField>
        <TextField select label="Side" name="side" defaultValue="Client">
          <MenuItem value="Client">Client</MenuItem>
          <MenuItem value="Delivery">Delivery (QualiZeal)</MenuItem>
          <MenuItem value="Observer">Observer</MenuItem>
        </TextField>
        <TextField select label="Risk level" name="riskLevel" defaultValue="Medium" helperText="Political/political-capital sensitivity">
          <MenuItem value="Low">Low</MenuItem><MenuItem value="Medium">Medium</MenuItem><MenuItem value="High">High</MenuItem>
        </TextField>
        <FormControlLabel sx={{ gridColumn: "1 / -1" }}
          control={<Checkbox name="dataOwner"/>}
          label="Data owner — controls access to raw evidence"/>
        <TextField sx={{ gridColumn: "1 / -1" }} label="Notes" name="notes" multiline rows={2} defaultValue=""/>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 2 }}>
        <Submit/>
      </Box>
    </form>
  );
}
