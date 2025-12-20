"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00d2ff", // Electric Blue
      contrastText: "#fff",
    },
    secondary: {
      main: "#9d50bb", // Vibrant Purple
    },
    background: {
      default: "#0a0a0c",
      paper: "#16161a",
    },
    text: {
      primary: "#f0f0f2",
      secondary: "#a0a0b0",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 4px 20px rgba(0, 210, 255, 0.3)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.4)",
        },
      },
    },
  },
});
