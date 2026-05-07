import { FitnessProvider } from "@/lib/fitness-context"
import { MultiStepForm } from "@/components/multi-step-form"

export default function FormPage() {
  return (
    <FitnessProvider>
      <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 16px" }}>
        <MultiStepForm />
      </main>
    </FitnessProvider>
  )
}
