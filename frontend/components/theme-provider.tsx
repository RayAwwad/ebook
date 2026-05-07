'use client'

import * as React from "react"
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from "@mui/material"

const sharedOverrides = {
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
          textTransform: "none" as const,
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
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#2196f3", contrastText: "#fff" },
    background: { default: "#0f1720", paper: "#162030" },
    text: { primary: "#f5f5f5", secondary: "#9ca3af" },
  },
  ...sharedOverrides,
})

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#2196f3", contrastText: "#fff" },
    background: { default: "transparent", paper: "#ffffff" },
    text: { primary: "#1a1a2e", secondary: "#4b5563" },
  },
  ...sharedOverrides,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MuiThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}

export function LightThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MuiThemeProvider theme={lightTheme}>
      <CssBaseline enableColorScheme />
      {children}
    </MuiThemeProvider>
  )
}

