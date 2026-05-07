import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsEmail,
  Min,
  Max,
} from 'class-validator';
import { Gender, ActivityLevel, ActivityType } from '../user.entity';

export class CreateUserDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsNumber()
  @Min(18)
  @Max(120)
  age!: number;

  @IsNumber()
  @Min(100)
  @Max(250)
  height!: number;

  @IsNumber()
  @Min(30)
  @Max(300)
  weight!: number;

  @IsEnum(Gender)
  gender!: Gender;

  @IsEnum(ActivityLevel)
  activityLevel!: ActivityLevel;

  @IsEnum(ActivityType)
  activityType!: ActivityType;

  @IsOptional()
  @IsEmail()
  email?: string;
}
