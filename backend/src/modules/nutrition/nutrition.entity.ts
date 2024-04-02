import { Entity, PrimaryGeneratedColumn, Column, ObjectIdColumn } from 'typeorm';

@Entity()
export class Nutrition {
    @ObjectIdColumn()
    _id?: number;

    @Column()
    name: string;

    @Column()
    inscription: string;

    @Column()
    crn: number;

    @Column()
    situation: boolean;

    @Column()
    type: string;

    @Column()
    last_update: string;
}