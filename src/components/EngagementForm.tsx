"use client";
import { useFormState, useFormStatus } from "react-dom";
import { createEngagement, type EngagementFormState } from "@/lib/actions";
import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";

const initial: EngagementFormState = {};

type Org = { id: string; name: string; type: string };
type Variant = { code: string; label: string; durationWeeks: number; description: string };
type User = { id: string; name: string | null; email: string | null; platformRoleCode: string; organizationId: string | null };

function Submit() {
  const { pending } = useFormStatus();
  return <Button type="submit" variant="contained" color="primary" size="large" disabled={pending}>{pending ? "Creating…" : "Create engagement"}</Button>;
}

const PHASE_NAMES: Record<number, string> = {
  1: "Focus & Prioritize",
  2: "Assess & Diagnose",
  3: "Govern & Enable",
  4: "Decide & Act",
};

const VFR_PRESETS = [
  { code: "Default",    title: "Default (Starter)",   v: 40, f: 35, r: 25, hint: "Recommended starting point — PG §8.12" },
  { code: "Regulated",  title: "Regulated / High-risk", v: 35, f: 35, r: 30, hint: "Financial services, healthcare, critical infra" },
  { code: "Innovation", title: "Early innovation scan", v: 45, f: 40, r: 15, hint: "Exploratory; risk lighter (PG §8.12)" },
  { code: "Execution",  title: "Execution push",       v: 30, f: 50, r: 20, hint: "Limited delivery bandwidth; favor feasibility" },
];

export default function EngagementForm({ orgs, variants, users }: { orgs: Org[]; variants: Variant[]; users: User[] }) {
  const [state, action] = useFormState(createEngagement, initial);
  const [orgId, setOrgId] = useState<string>("");
  const [phase, setPhase] = useState<number>(1);
  const [vfrCtx, setVfrCtx] = useState<string>("Default");
  const err = (k: string) => state.errors?.[k]?.[0];

  const clientOrg = orgs.find(o => o.id === orgId);
  const sponsorPool = users.filter(u => u.organizationId === orgId);                  // client-side
  const deliveryPool = users.filter(u => u.organizationId && orgs.find(o => o.id === u.organizationId)?.type === "Platform"); // QualiZeal

  return (
    <Paper sx={{ p: 3, border: "1px solid #E2E8F0", maxWidth: 1100 }}>
      {state.message && <Alert severity="error" sx={{ mb: 2 }}>{state.message}</Alert>}
      <form action={action}>
        {/* SECTION 1 — BASICS */}
        <Typography sx={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700, mb: 1 }}>1 · Basics</Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0,1fr))" }, mb: 3 }}>
          <TextField label="Engagement code" name="code" required defaultValue=""
            error={!!err("code")} helperText={err("code") || "Format ENG-YYYY-XX-NNN, e.g. ENG-2026-RB-003"} fullWidth/>
          <TextField select label="Organization (Client)" name="organizationId" required
            value={orgId} onChange={e => setOrgId(e.target.value)}
            error={!!err("organizationId")} helperText={err("organizationId") || "Pick from master data"} fullWidth>
            {orgs.filter(o => o.type !== "Platform").map(o => (
              <MenuItem key={o.id} value={o.id}>{o.name} <span style={{color:"#718096", marginLeft:6}}>· {o.type}</span></MenuItem>
            ))}
            {orgs.filter(o => o.type !== "Platform").length === 0 && (
              <MenuItem disabled>No client organizations yet — Admin → Organizations → New</MenuItem>
            )}
          </TextField>
          <TextField label="Industry" name="industry" defaultValue="" helperText="Free-text e.g. Banking, Pharma, Healthcare" fullWidth/>
          <TextField select label="Region" name="region" defaultValue={clientOrg?.name ? "EU-Central" : "EU-Central"} fullWidth>
            <MenuItem value="EU-Central">EU-Central</MenuItem>
            <MenuItem value="EU-West">EU-West</MenuItem>
            <MenuItem value="US-East">US-East</MenuItem>
            <MenuItem value="APAC-SG">APAC-SG</MenuItem>
          </TextField>
        </Box>

        {/* SECTION 2 — VARIANT (catalog only) */}
        <Typography sx={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700, mb: 1 }}>2 · Variant <span style={{textTransform:"none", fontWeight:500, color:"#718096"}}>· Participant Guide §4</span></Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0,1fr))" }, mb: 3 }}>
          <TextField select label="Variant" name="variantCode" defaultValue="VB" required helperText={err("variantCode") || `${variants.length} variants in catalog`} fullWidth>
            {variants.map(v => (
              <MenuItem key={v.code} value={v.code}>{v.label}</MenuItem>
            ))}
          </TextField>
        </Box>

        {/* SECTION 3 — METHOD STATE */}
        <Typography sx={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700, mb: 1 }}>3 · Method state</Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0,1fr))" }, mb: 3 }}>
          <TextField select label="Current phase" name="phase" value={phase} onChange={e => setPhase(Number(e.target.value))} fullWidth>
            <MenuItem value={1}>P1 · Focus &amp; Prioritize</MenuItem>
            <MenuItem value={2}>P2 · Assess &amp; Diagnose</MenuItem>
            <MenuItem value={3}>P3 · Govern &amp; Enable</MenuItem>
            <MenuItem value={4}>P4 · Decide &amp; Act</MenuItem>
          </TextField>
          <TextField label="Phase name" name="phaseName" value={PHASE_NAMES[phase] || ""} InputProps={{ readOnly: true }} fullWidth/>
          <TextField select label="Next gate" name="nextGate" defaultValue="G1" fullWidth>
            <MenuItem value="G1">G1 · Scope (post-kickoff, pre-P1)</MenuItem>
            <MenuItem value="G2">G2 · Shortlist (end-P1)</MenuItem>
            <MenuItem value="G3">G3 · Evidence (end-P2)</MenuItem>
            <MenuItem value="G4">G4 · Decision (end-P4)</MenuItem>
          </TextField>
          <TextField select label="Status" name="status" defaultValue="In flight" fullWidth>
            <MenuItem value="In flight">In flight</MenuItem>
            <MenuItem value="On hold">On hold</MenuItem>
            <MenuItem value="Trial">Trial</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </TextField>
        </Box>

        {/* SECTION 4 — TEAM (filtered by org) */}
        <Typography sx={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700, mb: 1 }}>4 · Team</Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0,1fr))" }, mb: 3 }}>
          <TextField select label={`Client sponsor${clientOrg?` (${clientOrg.name})`:""}`} name="sponsorUserId" required
            error={!!err("sponsorUserId")} helperText={err("sponsorUserId") || (orgId ? `${sponsorPool.length} users` : "Pick organization first")} fullWidth defaultValue="">
            {sponsorPool.length === 0 && <MenuItem disabled value="">No users — Admin → Users → Invite</MenuItem>}
            {sponsorPool.map(u => <MenuItem key={u.id} value={u.id}>{u.name} <span style={{color:"#718096", marginLeft:6}}>· {u.email}</span></MenuItem>)}
          </TextField>
          <TextField select label="Delivery lead (QualiZeal)" name="deliveryLeadUserId" required
            error={!!err("deliveryLeadUserId")} helperText={err("deliveryLeadUserId") || `${deliveryPool.length} QualiZeal users`} fullWidth defaultValue="">
            {deliveryPool.length === 0 && <MenuItem disabled value="">No QualiZeal users yet</MenuItem>}
            {deliveryPool.map(u => <MenuItem key={u.id} value={u.id}>{u.name} <span style={{color:"#718096", marginLeft:6}}>· {u.platformRoleCode}</span></MenuItem>)}
          </TextField>
          <TextField label="Start date" name="startDate" type="date" InputLabelProps={{ shrink: true }} fullWidth/>
          <TextField label="Target board readout date" name="targetDate" type="date" InputLabelProps={{ shrink: true }} fullWidth/>
        </Box>

        {/* SECTION 5 — V×F×R WEIGHTS PRESET */}
        <Typography sx={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700, mb: 1 }}>5 · V&times;F&times;R weighting <span style={{textTransform:"none", fontWeight:500, color:"#718096"}}>· Participant Guide §8.12</span></Typography>
        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0,1fr))" }, mb: 3 }}>
          {VFR_PRESETS.map(p => {
            const on = vfrCtx === p.code;
            return (
              <Paper key={p.code} sx={{ p: 1.5, border: on ? "2px solid #38B2AC" : "1px solid #E2E8F0", cursor: "pointer", background: on ? "#E6FFFA" : "#fff" }} onClick={() => setVfrCtx(p.code)}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{p.title}</Typography>
                  {on && <Chip size="small" label="Selected" sx={{ background: "#38B2AC", color: "#fff" }}/>}
                </Box>
                <Box sx={{ display: "flex", gap: 1, fontSize: 12, mb: 0.5 }}>
                  <Chip size="small" label={`V ${p.v}%`} sx={{ background: "#0B2240", color: "#fff", fontFamily: "JetBrains Mono, monospace" }}/>
                  <Chip size="small" label={`F ${p.f}%`} sx={{ background: "#1A365D", color: "#fff", fontFamily: "JetBrains Mono, monospace" }}/>
                  <Chip size="small" label={`R ${p.r}%`} sx={{ background: "#0E7C7B", color: "#fff", fontFamily: "JetBrains Mono, monospace" }}/>
                </Box>
                <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{p.hint}</Typography>
              </Paper>
            );
          })}
        </Box>
        <input type="hidden" name="vfrContext" value={vfrCtx}/>
        <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 3 }}>
          The Engagement Lead may fine-tune these weights after creation (Engagement detail → V&times;F&times;R panel). Per §8.12, weights should be agreed early, documented, and used consistently within a prioritization cycle.
        </Typography>

        {/* SECTION 6 — NOTES */}
        <Typography sx={{ fontSize: 11, letterSpacing: ".08em", textTransform: "uppercase", color: "text.secondary", fontWeight: 700, mb: 1 }}>6 · Notes (optional)</Typography>
        <TextField label="Engagement notes" name="notes" multiline rows={3} fullWidth sx={{ mb: 3 }}/>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button component="a" href="/dashboard" variant="text">Cancel</Button>
          <Submit/>
        </Box>
      </form>
    </Paper>
  );
}
