import { Module } from '@nestjs/common';
import { NutritionController } from './nutrition.controller';
import { NutritionService } from './nutrition.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nutrition } from './nutrition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nutrition])],
  controllers: [NutritionController],
  providers: [NutritionService]
})
export class NutritionModule {}
