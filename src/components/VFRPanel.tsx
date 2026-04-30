"use client";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateVFRWeights, type VFRState } from "@/lib/actions";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

type Weight = {
  id: string; engagementId: string;
  valueWeight: any; feasibilityWeight: any; riskAttractivenessWeight: any;
  context: string; rationale: string | null; lockedAt: Date | null;
};

const initial: VFRState = {};

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" variant="contained" disabled={pending}>{pending ? "Saving…" : "Save weights"}</Button>;
}

export default function VFRPanel({ weight }: { weight: Weight }) {
  const v = Number(weight.valueWeight); const f = Number(weight.feasibilityWeight); const r = Number(weight.riskAttractivenessWeight);
  const [open, setOpen] = useState(false);
  const [state, action] = useFormState(updateVFRWeights, initial);
  return (
    <Paper sx={{ p: 2.5, border: "1px solid #E2E8F0" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
        <Typography variant="h3">V×F×R weights</Typography>
        <Chip size="small" label={weight.context}/>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, mb: 2 }}>
        <Box><Typography sx={{ fontSize: 10, color: "#0B2240", letterSpacing: ".1em", fontWeight: 700 }}>VALUE</Typography><Typography sx={{ fontSize: 24, fontWeight: 800, fontFamily: "Manrope, sans-serif", color: "#0B2240" }}>{(v*100).toFixed(0)}%</Typography></Box>
        <Box><Typography sx={{ fontSize: 10, color: "#1A365D", letterSpacing: ".1em", fontWeight: 700 }}>FEASIBILITY</Typography><Typography sx={{ fontSize: 24, fontWeight: 800, fontFamily: "Manrope, sans-serif", color: "#1A365D" }}>{(f*100).toFixed(0)}%</Typography></Box>
        <Box><Typography sx={{ fontSize: 10, color: "#0E7C7B", letterSpacing: ".1em", fontWeight: 700 }}>RISK ATTR.</Typography><Typography sx={{ fontSize: 24, fontWeight: 800, fontFamily: "Manrope, sans-serif", color: "#0E7C7B" }}>{(r*100).toFixed(0)}%</Typography></Box>
      </Box>
      <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 1 }}>
        Defaults from <i>TrustScaleAI Participant Guide §8.12</i>: V=40% / F=35% / R=25%.
        {weight.rationale && <Box component="span" sx={{ display: "block", mt: 0.5 }}><b>Rationale:</b> {weight.rationale}</Box>}
        {weight.lockedAt && <Chip size="small" label="Locked at G1 pass" color="warning" sx={{ mt: 0.5 }}/>}
      </Typography>
      <Button size="small" variant="outlined" onClick={() => setOpen(true)} disabled={!!weight.lockedAt}>Adjust weights</Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <form action={action}>
          <DialogTitle>Adjust V×F×R weights</DialogTitle>
          <DialogContent>
            {state.message && state.errors && <Alert severity="error" sx={{ mb: 2 }}>{state.message}</Alert>}
            {state.message && !state.errors && <Alert severity="success" sx={{ mb: 2 }}>{state.message}</Alert>}
            <input type="hidden" name="engagementId" value={weight.engagementId}/>
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(3, minmax(0,1fr))", mt: 1 }}>
              <TextField label="Value" name="valueWeight" type="number" inputProps={{ step: 0.01, min: 0.05, max: 0.90 }} defaultValue={v.toFixed(2)} required helperText="Range 0.05–0.90"/>
              <TextField label="Feasibility" name="feasibilityWeight" type="number" inputProps={{ step: 0.01, min: 0.05, max: 0.90 }} defaultValue={f.toFixed(2)} required/>
              <TextField label="Risk Attr." name="riskAttractivenessWeight" type="number" inputProps={{ step: 0.01, min: 0.05, max: 0.90 }} defaultValue={r.toFixed(2)} required helperText="Sum must = 1.00"/>
              <TextField sx={{ gridColumn: "1 / -1" }} select label="Context" name="context" defaultValue={weight.context} required>
                <MenuItem value="Default">Default — V40/F35/R25</MenuItem>
                <MenuItem value="Regulated">Regulated — V35/F35/R30</MenuItem>
                <MenuItem value="Innovation">Innovation — V45/F40/R15</MenuItem>
                <MenuItem value="Execution">Execution — V30/F50/R20</MenuItem>
              </TextField>
              <TextField sx={{ gridColumn: "1 / -1" }} label="Rationale (required)" name="rationale" multiline rows={3} defaultValue={weight.rationale || ""} required helperText="Why depart from defaults? Surfaces in audit + G1 gate pack."/>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Submit/>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
}
