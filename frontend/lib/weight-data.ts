import { Gender } from "./fitness-context"

// Average weight data based on age, gender, and height
// This is mock data - in production, this would come from the NestJS backend
export function getAverageWeightData(
  userAge: number,
  userHeight: number,
  userWeight: number,
  gender: Gender
): { age: number; averageWeight: number; userWeight: number }[] {
  // Base average weight calculation (simplified BMI-based estimation)
  const heightInMeters = userHeight / 100
  const idealBMI = gender === "male" ? 23 : 22
  const baseIdealWeight = idealBMI * heightInMeters * heightInMeters

  // Generate data points for ages around the user's age
  const ageRange = 10
  const startAge = Math.max(18, userAge - ageRange)
  const endAge = Math.min(65, userAge + ageRange)

  const data: { age: number; averageWeight: number; userWeight: number }[] = []

  for (let age = startAge; age <= endAge; age++) {
    // Add some realistic variation based on age
    // Weight typically increases with age until around 50-55, then decreases slightly
    let ageModifier = 1

    if (age < 25) {
      ageModifier = 0.95 + (age - 18) * 0.007
    } else if (age < 35) {
      ageModifier = 1.0 + (age - 25) * 0.005
    } else if (age < 45) {
      ageModifier = 1.05 + (age - 35) * 0.003
    } else if (age < 55) {
      ageModifier = 1.08 + (age - 45) * 0.002
    } else {
      ageModifier = 1.1 - (age - 55) * 0.002
    }

    // Add gender variation
    const genderModifier = gender === "male" ? 1.1 : 1.0

    const averageWeight = Math.round(baseIdealWeight * ageModifier * genderModifier * 10) / 10

    data.push({
      age,
      averageWeight,
      userWeight: age === userAge ? userWeight : userWeight,
    })
  }

  return data
}

export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100
  return Math.round((weight / (heightM * heightM)) * 10) / 10
}

export function getBMICategory(bmi: number): { category: string; color: string } {
  if (bmi < 18.5) {
    return { category: "Underweight", color: "#60a5fa" }
  } else if (bmi < 25) {
    return { category: "Normal", color: "#4ade80" }
  } else if (bmi < 30) {
    return { category: "Overweight", color: "#fbbf24" }
  } else {
    return { category: "Obese", color: "#f87171" }
  }
}

export function getIdealWeightRange(heightCm: number, gender: Gender): { min: number; max: number } {
  const heightM = heightCm / 100
  const minBMI = 18.5
  const maxBMI = 24.9

  return {
    min: Math.round(minBMI * heightM * heightM * 10) / 10,
    max: Math.round(maxBMI * heightM * heightM * 10) / 10,
  }
}

// Activity Factors
export const ActivityFactors: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very active': 1.9,
}

// Training Type Modifiers
export const TrainingModifiers: Record<string, [number, number]> = {
  cardio: [1.00, 1.05],
  strength: [1.05, 1.15],
  flexibility: [0.95, 1.00],
  mixed: [1.10, 1.20],
  sports: [1.10, 1.25],
}

// Calculate BMR
export function calculateBMR({
  weight,
  height,
  age,
  gender,
  unitSystem = 'metric',
}: {
  weight: number
  height: number
  age: number
  gender: Gender
  unitSystem?: 'metric' | 'us'
}): number {
  if (unitSystem === 'metric') {
    // Mifflin-St Jeor (recommended)
    if (gender === 'male') {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5)
    } else if (gender === 'female') {
      return Math.round(10 * weight + 6.25 * height - 5 * age - 161)
    } else {
      // Average of male/female
      return Math.round(10 * weight + 6.25 * height - 5 * age - 78)
    }
  } else {
    // US system
    if (gender === 'male') {
      return Math.round(4.536 * weight + 15.88 * height - 5 * age + 5)
    } else if (gender === 'female') {
      return Math.round(4.536 * weight + 15.88 * height - 5 * age - 161)
    } else {
      return Math.round(4.536 * weight + 15.88 * height - 5 * age - 78)
    }
  }
}

// Calculate TDEE
export function calculateTDEE({
  bmr,
  activityLevel,
  activityType,
  trainingModifierValue,
}: {
  bmr: number
  activityLevel: keyof typeof ActivityFactors
  activityType: keyof typeof TrainingModifiers
  trainingModifierValue?: number // If not provided, use average of range
}): number {
  const af = ActivityFactors[activityLevel] || 1.2
  const tmRange = TrainingModifiers[activityType] || [1, 1]
  const tm = trainingModifierValue ?? ((tmRange[0] + tmRange[1]) / 2)
  return Math.round(bmr * af * tm)
}
