"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

export type Gender = "male" | "female" | "other"
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very-active"
export type ActivityType = "cardio" | "strength" | "flexibility" | "mixed" | "sports"

export interface UserData {
  firstName: string
  lastName: string
  age: number | null
  height: number | null
  weight: number | null
  gender: Gender | null
  activityLevel: ActivityLevel | null
  activityType: ActivityType | null
}

export interface FitnessContextType {
  userData: UserData
  updateUserData: (data: Partial<UserData>) => void
  resetUserData: () => void
  isPdfUnlocked: boolean
  unlockPdf: () => void
}

const initialUserData: UserData = {
  firstName: "",
  lastName: "",
  age: null,
  height: null,
  weight: null,
  gender: null,
  activityLevel: null,
  activityType: null,
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined)

export function FitnessProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(initialUserData)
  const [isPdfUnlocked, setIsPdfUnlocked] = useState(false)

  const updateUserData = useCallback((data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }))
  }, [])

  const resetUserData = useCallback(() => {
    setUserData(initialUserData)
    setIsPdfUnlocked(false)
  }, [])

  const unlockPdf = useCallback(() => {
    setIsPdfUnlocked(true)
  }, [])

  return (
    <FitnessContext.Provider
      value={{ userData, updateUserData, resetUserData, isPdfUnlocked, unlockPdf }}
    >
      {children}
    </FitnessContext.Provider>
  )
}

export function useFitness() {
  const context = useContext(FitnessContext)
  if (context === undefined) {
    throw new Error("useFitness must be used within a FitnessProvider")
  }
  return context
}
