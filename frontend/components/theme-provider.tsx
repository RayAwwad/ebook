'use client'

import * as React from "react"
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from "@mui/material"

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2196f3",
      contrastText: "#fff",
    },
    background: {
      default: "#0f1720",
      paper: "#162030",
    },
    text: {
      primary: "#f5f5f5",
      secondary: "#9ca3af",
    },
  },
  typography: {
    fontFamily: "var(--font-roboto), Roboto, sans-serif",
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}

