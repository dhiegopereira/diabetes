import { Controller, Get, Query } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { NutritionService } from './nutrition.service';

interface Nutrition {
    name: string;
    inscription: string;
    crn: number;
    situation: boolean;
    type: string;
    last_update: string;
}

@Controller('nutrition')
export class NutritionController {

    constructor(private readonly nutritionService: NutritionService) { }

    @Get()
    async readOne(
        @Query('name') name: string,
        @Query('inscription') inscription: string,
        @Query('crn') crn: string
    ): Promise<Nutrition> {        
        const nutrition: Nutrition = await this.nutritionService.readOne(inscription);

        if (!nutrition) {
            const newNutrition = await this.nutritionService.verifyCRN(name, inscription, crn);
            return this.nutritionService.create(newNutrition);
        }        
        return nutrition;
    }
}
