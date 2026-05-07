import { Entity, PrimaryKey, Property, Enum } from '@mikro-orm/core';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum ActivityLevel {
  SEDENTARY = 'sedentary',
  LIGHT = 'light',
  MODERATE = 'moderate',
  ACTIVE = 'active',
  VERY_ACTIVE = 'very-active',
}

export enum ActivityType {
  CARDIO = 'cardio',
  STRENGTH = 'strength',
  FLEXIBILITY = 'flexibility',
  MIXED = 'mixed',
  SPORTS = 'sports',
}

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  age!: number;

  @Property({ type: 'decimal', precision: 5, scale: 2 })
  height!: number;

  @Property({ type: 'decimal', precision: 5, scale: 2 })
  weight!: number;

  @Enum(() => Gender)
  gender!: Gender;

  @Enum(() => ActivityLevel)
  activityLevel!: ActivityLevel;

  @Enum(() => ActivityType)
  activityType!: ActivityType;

  @Property({ nullable: true })
  email?: string;

  @Property({ default: false })
  hasPurchasedReport: boolean = false;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
