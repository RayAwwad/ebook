import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { UsersModule } from './users/users.module';
import { StatisticsModule } from './statistics/statistics.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    UsersModule,
    StatisticsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
