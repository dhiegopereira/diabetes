import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Food } from '../modules/food/food.entity';
import { Nutrition } from 'src/modules/nutrition/nutrition.entity';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: 'mongodb',
    url: process.env.MONGODB_URL,
    entities: [Food, Nutrition],
    synchronize: true,
  } as TypeOrmModuleOptions,
  databaseTest: {
    type: 'sqlite',
    database: ':memory:',
    entities: [Food, Nutrition],
    synchronize: true,
  },
});