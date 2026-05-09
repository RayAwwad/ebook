"use client"

import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import NextLink from "next/link"
import { WeightComparisonChart } from "@/components/weight-comparison-chart"
import { PdfPreview } from "@/components/pdf-preview"
import { PaymentModal } from "@/components/payment-modal"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { getAverageWeightData, calculateBMI, getBMICategory, getIdealWeightRange, calculateBMR, calculateTDEE, ActivityFactors, TrainingModifiers } from "@/lib/weight-data"
import { Activity, TrendingUp, Scale, Target, Home } from "lucide-react"
import type { Gender } from "@/lib/fitness-context"
import dynamic from "next/dynamic"

export function ResultsContent() {
  const searchParams = useSearchParams()
  const [isPdfUnlocked, setIsPdfUnlocked] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

const TDEEChart = dynamic(() => import("./tdee-chart-client"), { ssr: false })


  const userData = useMemo(() => ({
    firstName: searchParams.get("firstName") || "",
    lastName: searchParams.get("lastName") || "",
    age: Number(searchParams.get("age")) || 25,
    height: Number(searchParams.get("height")) || 175,
    weight: Number(searchParams.get("weight")) || 70,
    gender: (searchParams.get("gender") as Gender) || "male",
    activityLevel: searchParams.get("activityLevel") || "moderate",
    activityType: searchParams.get("activityType") || "mixed",
  }), [searchParams])


  const chartData = useMemo(() => getAverageWeightData(userData.age, userData.height, userData.weight, userData.gender), [userData])
  const bmi = calculateBMI(userData.weight, userData.height)
  const bmiInfo = getBMICategory(bmi)
  const idealRange = getIdealWeightRange(userData.height, userData.gender)

  // Calculate BMR (metric only for now)
  const bmr = calculateBMR({
    weight: userData.weight,
    height: userData.height,
    age: userData.age,
    gender: userData.gender,
    unitSystem: 'metric',
  })

  // Calculate TDEE (apply TM only if not sedentary)
  let tm = 1.0
  if (userData.activityLevel !== 'sedentary') {
    const tmRange = TrainingModifiers[userData.activityType] || [1, 1]
    tm = (tmRange[0] + tmRange[1]) / 2
  }
  const tdee = calculateTDEE({
    bmr,
    activityLevel: userData.activityLevel,
    activityType: userData.activityType,
    trainingModifierValue: tm,
  })

  // Prepare BMR/TDEE chart data for common activity levels
  const tdeeChartData = Object.entries(ActivityFactors).map(([level, af]) => {
    let chartTM = 1.0
    if (level !== 'sedentary') {
      const tmRange = TrainingModifiers[userData.activityType] || [1, 1]
      chartTM = (tmRange[0] + tmRange[1]) / 2
    }
    const tdeeVal = Math.round(bmr * af * chartTM)
    return { level, tdee: tdeeVal }
  })

  return (
    <Box sx={{ width: "100%", maxWidth: 900 }}>
      {/* Back link */}
      <Box sx={{ mb: 3 }}>
        <NextLink href="/" style={{ textDecoration: "none" }}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, color: "text.secondary", fontSize: 14, "&:hover": { color: "text.primary" }, transition: "color 0.2s" }}>
            <Home size={16} />
            Back to Home
          </Box>
        </NextLink>
      </Box>

      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 0.75, borderRadius: 99, bgcolor: "rgba(33,150,243,0.1)", border: "1px solid rgba(33,150,243,0.2)", mb: 2 }}>
          <Activity size={16} color="#2196f3" />
          <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 600 }}>Your Results</Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back, {userData.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here&apos;s how your metrics compare to others with similar profiles
        </Typography>
      </Box>

      {/* Stats grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr 1fr" }, gap: 2, mb: 4 }}>
        <StatCard icon={<Scale size={20} />} label="Your Weight" value={`${userData.weight} kg`} />
        <StatCard icon={<TrendingUp size={20} />} label="BMI" value={bmi.toString()} subtitle={bmiInfo.category} subtitleColor={bmiInfo.color} />
        <StatCard icon={<Target size={20} />} label="Ideal Range" value={`${idealRange.min}-${idealRange.max} kg`} />
        <StatCard icon={<Activity size={20} />} label="Activity" value={userData.activityLevel.replace("-", " ")} />
      </Box>


      {/* Chart */}
      <Card sx={{ border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Weight Comparison</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your weight compared to the average for your age, gender, and height
          </Typography>
          <WeightComparisonChart data={chartData} userAge={userData.age} />
        </CardContent>
      </Card>

      {/* BMR/TDEE Stats and Chart */}
      <Card sx={{ border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.10)", mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>BMR & TDEE</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) based on your profile and activity
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mb: 2 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>BMR</Typography>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>{bmr} kcal/day</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>TDEE</Typography>
              <Typography variant="h5" color="secondary" sx={{ fontWeight: 700 }}>{tdee} kcal/day</Typography>
            </Box>
          </Box>
          <Box sx={{ width: '100%', height: 260 }}>
            {/* Simple bar chart for TDEE by activity level */}
            <TDEEChart data={tdeeChartData} userLevel={userData.activityLevel} />
          </Box>
        </CardContent>
      </Card>

      {/* PDF */}

      <PdfPreview
        isUnlocked={isPdfUnlocked}
        userData={userData}
        onGeneratePdf={() => { if (!isPdfUnlocked) setIsPaymentModalOpen(true) }}
        bmi={bmi}
        bmiCategory={bmiInfo.category}
        idealRange={idealRange}
        bmr={bmr}
        tdee={tdee}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={() => { setIsPdfUnlocked(true); setIsPaymentModalOpen(false) }}
      />
    </Box>
  )
}

function StatCard({ icon, label, value, subtitle, subtitleColor }: {
  icon: React.ReactNode; label: string; value: string; subtitle?: string; subtitleColor?: string
}) { 
  return (
    <Card sx={{ border: "1px solid rgba(0,0,0,0.1)" }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: "rgba(33,150,243,0.1)", color: "primary.main", display: "flex" }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, textTransform: "capitalize", lineHeight: 1.2 }}>{value}</Typography>
            {subtitle && <Typography variant="caption" sx={{ fontWeight: 600 }} style={{ color: subtitleColor }}>{subtitle}</Typography>}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
