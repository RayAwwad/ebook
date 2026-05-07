import { Suspense } from "react"
import { FitnessProvider } from "@/lib/fitness-context"
import { ResultsContent } from "@/components/results-content"
import CircularProgress from "@mui/material/CircularProgress"
import Box from "@mui/material/Box"

export default function ResultsPage() {
  return (
    <FitnessProvider>
      <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 16px" }}>
        <Suspense fallback={
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
            <CircularProgress />
          </Box>
        }>
          <ResultsContent />
        </Suspense>
      </main>
    </FitnessProvider>
  )
}
