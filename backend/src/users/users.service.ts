import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { User, Gender } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.em.create(User, createUserDto as any);
    await this.em.persist(user).flush();
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.em.find(User, {});
  }

  async findOne(id: number): Promise<User> {
    const user = await this.em.findOne(User, { id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async markReportPurchased(id: number): Promise<User> {
    const user = await this.findOne(id);
    user.hasPurchasedReport = true;
    await this.em.flush();
    return user;
  }

  async getStatsByGenderAndAge(
    gender: string,
    ageMin: number,
    ageMax: number,
  ): Promise<{ averageWeight: number; count: number }> {
    const users = await this.em.find(User, {
      gender: gender as Gender,
      age: { $gte: ageMin, $lte: ageMax },
    });

    if (users.length === 0) {
      return { averageWeight: 0, count: 0 };
    }

    const totalWeight = users.reduce((sum, user) => sum + Number(user.weight), 0);
    return {
      averageWeight: Math.round((totalWeight / users.length) * 10) / 10,
      count: users.length,
    };
  }
}
