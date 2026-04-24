"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary:   { main: "#0B2240", dark: "#051330", light: "#1A365D", contrastText: "#fff" },   // navy
    secondary: { main: "#38B2AC", dark: "#0E7C7B", light: "#B2F5EA", contrastText: "#fff" },   // teal
    success:   { main: "#2F855A" },
    warning:   { main: "#D69E2E" },
    error:     { main: "#C53030" },
    background:{ default: "#F7FAFC", paper: "#FFFFFF" },
    text:      { primary: "#1A202C", secondary: "#4A5568" },
    divider:   "#E2E8F0",
  },
  typography: {
    fontFamily: '"Inter", "Manrope", system-ui, sans-serif',
    h1: { fontFamily: '"Manrope", sans-serif', fontWeight: 800, fontSize: 28 },
    h2: { fontFamily: '"Manrope", sans-serif', fontWeight: 800, fontSize: 22 },
    h3: { fontFamily: '"Manrope", sans-serif', fontWeight: 700, fontSize: 17 },
    h4: { fontFamily: '"Manrope", sans-serif', fontWeight: 700, fontSize: 14 },
    body1: { fontSize: 14 },
    body2: { fontSize: 13 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: 8 },
        containedPrimary: { boxShadow: "none" },
      },
    },
    MuiCard:   { styleOverrides: { root: { borderRadius: 10, boxShadow: "0 1px 2px rgba(0,0,0,.04)" } } },
    MuiPaper:  { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiChip:   { styleOverrides: { root: { fontWeight: 600, fontSize: 11.5 } } },
    MuiTextField: { defaultProps: { size: "small" } },
  },
});

export default theme;
