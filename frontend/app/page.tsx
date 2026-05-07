import { LandingHero } from "@/components/landing-hero"
import { FitnessProvider } from "@/lib/fitness-context"

export default function Home() {
  return (
    <FitnessProvider>
      <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <LandingHero />
      </main>
    </FitnessProvider>
  )
}
