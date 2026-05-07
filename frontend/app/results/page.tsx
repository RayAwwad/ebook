import { Suspense } from "react"
import { FitnessProvider } from "@/lib/fitness-context"
import { ResultsContent } from "@/components/results-content"
import { LightThemeProvider } from "@/components/theme-provider"
import CircularProgress from "@mui/material/CircularProgress"
import Box from "@mui/material/Box"

const BG_IMAGE = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&q=80"

export default function ResultsPage() {
  return (
    <LightThemeProvider>
      <FitnessProvider>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "48px 16px",
            position: "relative",
          }}
        >
          {/* Background image */}
          <div
            aria-hidden="true"
            style={{
              position: "fixed",
              inset: 0,
              backgroundImage: `url('${BG_IMAGE}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
          />
          {/* Light overlay */}
          <div
            aria-hidden="true"
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(255,255,255,0.82)",
              zIndex: 1,
            }}
          />
          {/* Content */}
          <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Suspense fallback={
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
                <CircularProgress />
              </Box>
            }>
              <ResultsContent />
            </Suspense>
          </div>
        </main>
      </FitnessProvider>
    </LightThemeProvider>
  )
}
