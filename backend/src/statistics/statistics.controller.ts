import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('weight-comparison')
  async getWeightComparison(
    @Query('age') age: string,
    @Query('height') height: string,
    @Query('weight') weight: string,
    @Query('gender') gender: string,
  ) {
    const data = await this.statisticsService.getWeightComparison(
      parseInt(age),
      parseFloat(height),
      parseFloat(weight),
      gender,
    );

    const bmi = this.statisticsService.calculateBMI(
      parseFloat(weight),
      parseFloat(height),
    );
    const bmiInfo = this.statisticsService.getBMICategory(bmi);
    const idealRange = this.statisticsService.getIdealWeightRange(
      parseFloat(height),
      gender,
    );

    return {
      chartData: data,
      bmi,
      bmiCategory: bmiInfo.category,
      bmiColor: bmiInfo.color,
      idealRange,
    };
  }
}
