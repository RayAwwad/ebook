import { FitnessProvider } from "@/lib/fitness-context"
import { MultiStepForm } from "@/components/multi-step-form"
import { LightThemeProvider } from "@/components/theme-provider"

const BG_IMAGE = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&q=80"

export default function FormPage() {
  return (
    <LightThemeProvider>
      <FitnessProvider>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
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
          <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", justifyContent: "center" }}>
            <MultiStepForm />
          </div>
        </main>
      </FitnessProvider>
    </LightThemeProvider>
  )
}
