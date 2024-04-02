import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NutritionModule } from './modules/nutrition/nutrition.module';
import { FoodModule } from './modules/food/food.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import configuration from './config/configuration';

@Module({
  imports: [
      ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get<TypeOrmModuleOptions>('database'),
      inject: [ConfigService],
    }),
    NutritionModule,
    FoodModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
