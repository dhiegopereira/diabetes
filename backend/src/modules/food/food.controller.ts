import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FoodService } from './food.service';
import * as fs from 'fs';
import { Food } from './food.entity';



@Controller('food')
export class FoodController {

    constructor(private readonly foodService: FoodService) { }

    @Post()
    async create(@Body() foodData: Food): Promise<Food> {       
        return await this.foodService.create(foodData);
    }

    @Get()
    async readAll(): Promise<Food[]> {
        return await this.foodService.readAll();
    }

}
