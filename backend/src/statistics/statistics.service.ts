import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

export interface WeightDataPoint {
  age: number;
  averageWeight: number;
  userWeight: number;
}

@Injectable()
export class StatisticsService {
  constructor(private readonly usersService: UsersService) {}

  async getWeightComparison(
    userAge: number,
    userHeight: number,
    userWeight: number,
    gender: string,
  ): Promise<WeightDataPoint[]> {
    const data: WeightDataPoint[] = [];
    const ageRange = 10;
    const startAge = Math.max(18, userAge - ageRange);
    const endAge = Math.min(65, userAge + ageRange);

    // Calculate ideal weight based on height (simplified BMI-based estimation)
    const heightInMeters = userHeight / 100;
    const idealBMI = gender === 'male' ? 23 : 22;
    const baseIdealWeight = idealBMI * heightInMeters * heightInMeters;

    for (let age = startAge; age <= endAge; age++) {
      // Try to get real data from the database
      const stats = await this.usersService.getStatsByGenderAndAge(
        gender,
        age - 2,
        age + 2,
      );

      let averageWeight: number;
      if (stats.count >= 5) {
        // Use real data if we have enough samples
        averageWeight = stats.averageWeight;
      } else {
        // Fall back to calculated estimates
        let ageModifier = 1;
        if (age < 25) {
          ageModifier = 0.95 + (age - 18) * 0.007;
        } else if (age < 35) {
          ageModifier = 1.0 + (age - 25) * 0.005;
        } else if (age < 45) {
          ageModifier = 1.05 + (age - 35) * 0.003;
        } else if (age < 55) {
          ageModifier = 1.08 + (age - 45) * 0.002;
        } else {
          ageModifier = 1.1 - (age - 55) * 0.002;
        }

        const genderModifier = gender === 'male' ? 1.1 : 1.0;
        averageWeight =
          Math.round(baseIdealWeight * ageModifier * genderModifier * 10) / 10;
      }

      data.push({
        age,
        averageWeight,
        userWeight,
      });
    }

    return data;
  }

  calculateBMI(weight: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return Math.round((weight / (heightM * heightM)) * 10) / 10;
  }

  getBMICategory(bmi: number): { category: string; color: string } {
    if (bmi < 18.5) {
      return { category: 'Underweight', color: '#60a5fa' };
    } else if (bmi < 25) {
      return { category: 'Normal', color: '#4ade80' };
    } else if (bmi < 30) {
      return { category: 'Overweight', color: '#fbbf24' };
    } else {
      return { category: 'Obese', color: '#f87171' };
    }
  }

  getIdealWeightRange(
    heightCm: number,
    gender: string,
  ): { min: number; max: number } {
    const heightM = heightCm / 100;
    const minBMI = 18.5;
    const maxBMI = 24.9;

    return {
      min: Math.round(minBMI * heightM * heightM * 10) / 10,
      max: Math.round(maxBMI * heightM * heightM * 10) / 10,
    };
  }
}
