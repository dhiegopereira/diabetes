import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Food } from './food.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FoodService {
    constructor(@InjectRepository(Food) private readonly foodRepository: Repository<Food>) { }

    async create(foodData: Food): Promise<Food> {

        const existingFood = await this.foodRepository.find({ where: { name: foodData.name } })

        if (existingFood[0]) {
            throw new ConflictException('This food is already in use');
        }

        const newFood = this.foodRepository.create(foodData);
        return await this.foodRepository.save(newFood);
    }

    async readAll(): Promise<Food[]> {
        return await this.foodRepository.find();
    }
}
