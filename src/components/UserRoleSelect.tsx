"use client";
import { useState, useTransition } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { updateUserRole } from "@/lib/admin-actions";

type Role = { code: string; name: string };

export default function UserRoleSelect({ userId, value, roles }: { userId: string; value: string; roles: Role[] }) {
  const [val, setVal] = useState(value);
  const [pending, start] = useTransition();
  return (
    <Select size="small" value={val} disabled={pending} sx={{ fontSize: 12, minWidth: 220 }}
      onChange={(e) => {
        const next = e.target.value;
        setVal(next);
        start(() => { updateUserRole(userId, next).catch(() => setVal(value)); });
      }}>
      {roles.map(r => <MenuItem key={r.code} value={r.code} sx={{ fontSize: 12 }}>{r.code} · {r.name}</MenuItem>)}
    </Select>
  );
}
