import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nutrition } from './nutrition.entity';
import { Repository } from 'typeorm';
import puppeteer from 'puppeteer';

@Injectable()
export class NutritionService {
    constructor(@InjectRepository(Nutrition) private readonly nutritionRepository: Repository<Nutrition>) { }

    async create(nutritionData: Nutrition): Promise<Nutrition> {
        const existingNutrition = await this.nutritionRepository.find({
            where: { inscription: nutritionData.inscription },
        });

        if (existingNutrition[0]) {
            throw new ConflictException('This inscription is already in use');
        }

        const newNutrition = this.nutritionRepository.create(nutritionData);
        return this.nutritionRepository.save(newNutrition);
    }

    async readAll(): Promise<Nutrition[]> {
        return this.nutritionRepository.find();
    }

    async readOne(inscription: string): Promise<Nutrition> {
        const existingNutrition = await this.nutritionRepository.find({
            where: { inscription },
            select: ['name', 'inscription', 'crn', 'situation', 'type', 'last_update'],
        });

        if (!existingNutrition) {
            return {} as Nutrition;
        }

        // const [day, month, year] = existingNutrition[0].last_update.split("-");
        // const providedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        // const currentDate = new Date();
        // const differenceInMilliseconds = currentDate.getTime() - providedDate.getTime();
        // const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

        // if (differenceInDays > 10) {
        //     return this.verifyCRN(existingNutrition[0].name, existingNutrition[0].inscription, existingNutrition[0].crn.toString());
        // } 

        return existingNutrition[0];
    }

    async verifyCRN(name: string, inscription: string, crn: string): Promise<Nutrition> {
        const browser = await puppeteer.launch({
            headless: true
        });
        const page: any = await browser.newPage();

        await page.goto('https://cnn.cfn.org.br/application/index/consulta-nacional');

        const nutrition: Nutrition = await page.evaluate(async (name, inscription, crn) => {
            function dispatchChangeEvent(element: EventTarget) {
                const event = new Event('change', {
                    bubbles: true,
                    cancelable: true,
                });
                element.dispatchEvent(event);
            }

            const inputName = document.querySelector('input[name="nome"]') as HTMLInputElement;
            inputName.value = name;
            dispatchChangeEvent(inputName);

            const inputRegistration = document.querySelector('input[name="registro"]') as HTMLInputElement;
            inputRegistration.value = inscription;
            dispatchChangeEvent(inputRegistration);

            const selectCRN = document.querySelector('select[name="crn"]') as HTMLSelectElement;
            selectCRN.value = crn;
            dispatchChangeEvent(selectCRN);

            const inputCRN = document.querySelector('input.search') as HTMLInputElement;
            inputCRN.value = 'CRN' + crn;
            dispatchChangeEvent(inputCRN);

            const buttonPesquisar = document.evaluate('//button[contains(text(), "Pesquisar")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLButtonElement;
            buttonPesquisar.click();

            await new Promise(resolve => setTimeout(resolve, 5000));

            const tr = document.querySelector('table.ui.table tbody tr');
            const tds = tr.querySelectorAll('td');

            const nutrition: Nutrition = {
                name: tds[0].textContent.trim(),
                inscription: tds[1].textContent.trim(),
                crn: parseInt(tds[2].textContent.trim().replace('CRN', '')),
                situation: tds[3].querySelector('div').textContent.trim().toUpperCase() === 'ATIVO',
                type: tds[4].querySelector('div').textContent.trim(),
                last_update: tds[5].querySelector('small').textContent.trim()
            };
            return nutrition;
        }, name, inscription, crn);
        await browser.close();
        return nutrition;
    }
}
