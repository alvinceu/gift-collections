import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Collection } from "./collection.entity";
import { Tag } from "./tag.entity";

@Entity()
export class GiftItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    image: string;

    @Column('numeric')
    price: number;

    @Column({ type: 'enum', enum: ['RUB', 'USD', 'EUR']})
    currency: Currency;

    @Column()
    description: string;

    @ManyToMany(() => Tag, (tag) => tag.giftItems, { cascade: true, eager: true })
    @JoinTable({ name: 'gift_item_tags' })
    tags: Tag[];

    @Column()
    link: string;

    @CreateDateColumn()
    createdAt: string;

    @Column({ type: 'uuid' })
    collectionId: string;

    @ManyToOne(() => Collection, (collection) => collection.items)
    collection: Collection
}

export type Currency = 'RUB' | 'USD' | 'EUR'