"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import NextLink from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useFitness, Gender, ActivityLevel, ActivityType } from "@/lib/fitness-context"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CircularProgress from "@mui/material/CircularProgress"
import { ArrowLeft, ArrowRight, User, Ruler, Activity, CheckCircle, Home } from "lucide-react"

type UnitSystem = "metric" | "us"

const stepInfo = [
  { title: "Personal Info", description: "Tell us about yourself", icon: User },
  { title: "Body Metrics", description: "Your physical measurements", icon: Ruler },
  { title: "Activity Level", description: "How active are you?", icon: Activity },
  { title: "Activity Type", description: "What do you enjoy?", icon: Activity },
]

export function MultiStepForm() {
  const router = useRouter()
  const { userData } = useFitness()
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [isSaving, setIsSaving] = useState(false)
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric")

  const isSedentary = userData.activityLevel === "sedentary"
  const totalSteps = isSedentary ? 3 : 4

  const submitForm = async () => {
    setIsSaving(true)
    try {
      await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
          age: userData.age || 0,
          height: userData.height || 0,
          weight: userData.weight || 0,
          gender: userData.gender || "other",
          activityLevel: userData.activityLevel || "sedentary",
          activityType: isSedentary ? "mixed" : (userData.activityType || "mixed"),
        }),
      })
    } catch {
      // silently fail
    } finally {
      setIsSaving(false)
    }
    const params = new URLSearchParams({
      firstName: userData.firstName,
      lastName: userData.lastName,
      age: String(userData.age || 0),
      height: String(userData.height || 0),
      weight: String(userData.weight || 0),
      gender: userData.gender || "",
      activityLevel: userData.activityLevel || "",
      activityType: isSedentary ? "" : (userData.activityType || ""),
    })
    router.push(`/results?${params.toString()}`)
  }

  const nextStep = async () => {
    if (currentStep < totalSteps) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
    } else {
      await submitForm()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return userData.firstName.trim() !== "" && userData.lastName.trim() !== ""
      case 2: return userData.age !== null && userData.height !== null && userData.weight !== null && userData.gender !== null
      case 3: return userData.activityLevel !== null
      case 4: return userData.activityType !== null
      default: return false
    }
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? 80 : -80, opacity: 0 }),
  }

  const StepIcon = stepInfo[currentStep - 1].icon

  return (
    <Box sx={{ width: "100%", maxWidth: 520 }}>
      {/* Back link */}
      <Box sx={{ mb: 3 }}>
        <NextLink href="/" style={{ textDecoration: "none" }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, color: "text.secondary", fontSize: 14, "&:hover": { color: "text.primary" }, transition: "color 0.2s" }}>
            <Home size={16} />
            Back to Home
          </Box>
        </NextLink>
      </Box>

      {/* Step indicators */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 4 }}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <Box key={i} sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 40, height: 40, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 600,
                transition: "all 0.3s",
                bgcolor: i + 1 < currentStep ? "primary.main" : i + 1 === currentStep ? "rgba(33,150,243,0.15)" : "rgba(0,0,0,0.05)",
                border: i + 1 === currentStep ? "2px solid" : "2px solid transparent",
                borderColor: i + 1 === currentStep ? "primary.main" : "transparent",
                color: i + 1 < currentStep ? "#fff" : i + 1 === currentStep ? "primary.main" : "text.secondary",
              }}
            >
              {i + 1 < currentStep ? <CheckCircle size={18} /> : i + 1}
            </Box>
            {i < totalSteps - 1 && (
              <Box sx={{ width: 40, height: 2, mx: 0.5, bgcolor: i + 1 < currentStep ? "primary.main" : "rgba(0,0,0,0.15)", transition: "bgcolor 0.3s" }} />
            )}
          </Box>
        ))}
      </Box>

      <Card sx={{ border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box sx={{ display: "inline-flex", p: 1.5, borderRadius: 2, bgcolor: "rgba(33,150,243,0.1)", mb: 2 }}>
              <StepIcon size={24} color="#2196f3" />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {stepInfo[currentStep - 1].title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stepInfo[currentStep - 1].description}
            </Typography>
          </Box>

          {/* Animated step content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {currentStep === 1 && <StepOne />}
              {currentStep === 2 && <StepTwo unitSystem={unitSystem} setUnitSystem={setUnitSystem} />}
              {currentStep === 3 && <StepThree />}
              {currentStep === 4 && <StepFour />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button
              variant="outlined"
              onClick={prevStep}
              disabled={currentStep === 1}
              startIcon={<ArrowLeft size={16} />}
              sx={{ borderColor: "rgba(0,0,0,0.23)", color: "text.primary", "&:hover": { borderColor: "rgba(0,0,0,0.5)" } }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={nextStep}
              disabled={!isStepValid() || isSaving}
              endIcon={isSaving ? undefined : <ArrowRight size={16} />}
            >
              {isSaving ? <CircularProgress size={18} color="inherit" /> : currentStep === totalSteps ? "See Results" : "Continue"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

function StepOne() {
  const { userData, updateUserData } = useFitness()
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <TextField
        label="First Name"
        placeholder="John"
        value={userData.firstName}
        onChange={(e) => updateUserData({ firstName: e.target.value })}
        fullWidth
        variant="outlined"
      />
      <TextField
        label="Last Name"
        placeholder="Doe"
        value={userData.lastName}
        onChange={(e) => updateUserData({ lastName: e.target.value })}
        fullWidth
        variant="outlined"
      />
    </Box>
  )
}

function StepTwo({ unitSystem, setUnitSystem }: { unitSystem: UnitSystem; setUnitSystem: (u: UnitSystem) => void }) {
  const { userData, updateUserData } = useFitness()
  const [feet, setFeet] = useState<string>("")
  const [inches, setInches] = useState<string>("")
  const [lbs, setLbs] = useState<string>("")

  const genderOptions: { value: Gender; label: string }[] = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ]

  const handleUnitToggle = (system: UnitSystem) => {
    setUnitSystem(system)
    updateUserData({ height: null, weight: null })
    setFeet(""); setInches(""); setLbs("")
  }

  const handleUsHeightChange = (newFeet: string, newInches: string) => {
    setFeet(newFeet); setInches(newInches)
    const total = (parseFloat(newFeet) || 0) * 12 + (parseFloat(newInches) || 0)
    updateUserData({ height: total > 0 ? Math.round(total * 2.54) : null })
  }

  const handleUsWeightChange = (val: string) => {
    setLbs(val)
    const w = parseFloat(val)
    updateUserData({ weight: w > 0 ? Math.round(w * 0.453592 * 10) / 10 : null })
  }

  const toggleBtnSx = (active: boolean) => ({
    px: 2.5, py: 1, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer",
    bgcolor: active ? "primary.main" : "transparent",
    color: active ? "#fff" : "text.secondary",
    transition: "all 0.2s",
    "&:hover": { bgcolor: active ? "primary.main" : "rgba(119, 90, 90, 0.06)" },
  })

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Unit toggle */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ display: "flex", borderRadius: 1.5, border: "1px solid rgba(0,0,0,0.2)", overflow: "hidden" }}>
          <Box component="button" type="button" onClick={() => handleUnitToggle("metric")} sx={toggleBtnSx(unitSystem === "metric")}>
            Metric (cm / kg)
          </Box>
          <Box component="button" type="button" onClick={() => handleUnitToggle("us")} sx={toggleBtnSx(unitSystem === "us")}>
            US (ft / lbs)
          </Box>
        </Box>
      </Box>

      <TextField label="Age" type="number" placeholder="25" value={userData.age ?? ""}
        onChange={(e) => updateUserData({ age: e.target.value ? Number(e.target.value) : null })}
        fullWidth slotProps={{
          htmlInput: {
            min: 1,
          },
        }} />

      {unitSystem === "metric" ? (
        <TextField label="Height (cm)" type="number" placeholder="175" value={userData.height ?? ""}
          onChange={(e) => updateUserData({ height: e.target.value ? Number(e.target.value) : null })}
          fullWidth slotProps={{
            htmlInput: {
              min: 1,
            },
          }} />
      ) : (
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>Height</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
            <TextField label="Feet" type="number" placeholder="5" value={feet}
              onChange={(e) => handleUsHeightChange(e.target.value, inches)} slotProps={{
                htmlInput: {
                  min: 0,
                },
              }} />
            <TextField label="Inches" type="number" placeholder="10" value={inches}
              onChange={(e) => handleUsHeightChange(feet, e.target.value)} slotProps={{
              htmlInput: {
                min: 0,
                max: 11,
              },
              }} />
          </Box>
        </Box>
      )}

      {unitSystem === "metric" ? (
        <TextField label="Weight (kg)" type="number" placeholder="70" value={userData.weight ?? ""}
          onChange={(e) => updateUserData({ weight: e.target.value ? Number(e.target.value) : null })}
          fullWidth slotProps={{
            htmlInput: {
              min: 1,
            },
          }} />
      ) : (
        <TextField label="Weight (lbs)" type="number" placeholder="154" value={lbs}
          onChange={(e) => handleUsWeightChange(e.target.value)} fullWidth slotProps={{
          htmlInput: {
            min: 1,
          },
        }} />
      )}

      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>Gender</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1.5 }}>
          {genderOptions.map((opt) => (
            <Box
              key={opt.value}
              component="button"
              type="button"
              onClick={() => updateUserData({ gender: opt.value })}
              sx={{
                height: 48, borderRadius: 1.5, border: "1px solid",
                borderColor: userData.gender === opt.value ? "primary.main" : "rgba(0,0,0,0.2)",
                bgcolor: userData.gender === opt.value ? "rgba(33,150,243,0.15)" : "rgba(0,0,0,0.04)",
                color: userData.gender === opt.value ? "primary.main" : "text.primary",
                fontWeight: 500, fontSize: 14, cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {opt.label}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

function StepThree() {
  const { userData, updateUserData } = useFitness()
  const levels: { value: ActivityLevel; label: string; description: string }[] = [
    { value: "sedentary", label: "Sedentary", description: "Little to no exercise" },
    { value: "light", label: "Lightly Active", description: "Light exercise 1-3 days/week" },
    { value: "moderate", label: "Moderately Active", description: "Moderate exercise 3-5 days/week" },
    { value: "active", label: "Active", description: "Hard exercise 6-7 days/week" },
    { value: "very active", label: "Very Active", description: "Very hard exercise daily" },
  ]
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {levels.map((level) => (
        <Box
          key={level.value}
          component="button"
          type="button"
          onClick={() => updateUserData({ activityLevel: level.value })}
          sx={{
            p: 2, borderRadius: 2, border: "1px solid", textAlign: "left", cursor: "pointer",
            borderColor: userData.activityLevel === level.value ? "primary.main" : "rgba(0,0,0,0.15)",
            bgcolor: userData.activityLevel === level.value ? "rgba(33,150,243,0.1)" : "rgba(0,0,0,0.02)",
            transition: "all 0.2s",
            "&:hover": { borderColor: "rgba(33,150,243,0.5)", bgcolor: "rgba(33,150,243,0.06)" },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", mb: 0.25 }}>{level.label}</Typography>
          <Typography variant="caption" color="text.secondary">{level.description}</Typography>
        </Box>
      ))}
    </Box>
  )
}

function StepFour() {
  const { userData, updateUserData } = useFitness()
  const types: { value: ActivityType; label: string; description: string }[] = [
    { value: "cardio", label: "Cardio", description: "Running, cycling, swimming" },
    { value: "strength", label: "Strength Training", description: "Weightlifting, resistance" },
    { value: "flexibility", label: "Flexibility", description: "Yoga, stretching, pilates" },
    { value: "mixed", label: "Mixed Training", description: "Combination of all types" },
    { value: "sports", label: "Sports", description: "Team sports, martial arts" },
  ]
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      {types.map((type) => (
        <Box
          key={type.value}
          component="button"
          type="button"
          onClick={() => updateUserData({ activityType: type.value })}
          sx={{
            p: 2, borderRadius: 2, border: "1px solid", textAlign: "left", cursor: "pointer",
            borderColor: userData.activityType === type.value ? "primary.main" : "rgba(0,0,0,0.15)",
            bgcolor: userData.activityType === type.value ? "rgba(33,150,243,0.1)" : "rgba(0,0,0,0.02)",
            transition: "all 0.2s",
            "&:hover": { borderColor: "rgba(33,150,243,0.5)", bgcolor: "rgba(33,150,243,0.06)" },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", mb: 0.25 }}>{type.label}</Typography>
          <Typography variant="caption" color="text.secondary">{type.description}</Typography>
        </Box>
      ))}
    </Box>
  )
}
