import { Entity, PrimaryGeneratedColumn, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class Food {
    @ObjectIdColumn()
    _id?: number;

    @Column()
    name: string;

    @Column()
    carbs: string;

    @Column()
    sugar: string;

    @Column()
    fats: string;

    @Column()
    sodium: string;

    @Column()
    proteins: string;

    @Column()
    fibers: string;

    @Column()
    glycemic_index: number;

    @Column()
    observation: string;
}