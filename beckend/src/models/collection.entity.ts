import {GiftItem} from "./giftitem.entity";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./user.entity";
import {Tag} from "./tag.entity";

@Entity()
export class Collection {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ type: 'uuid' })
    authorId: string;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'authorId' })
    author?: User;

    @Column()
    authorName: string;

    @Column()
    coverImage: string;

    @ManyToMany(() => Tag, (tag) => tag.collections, { cascade: true, eager: true })
    @JoinTable({ name: 'collection_tags' })
    tags: Tag[];

    @OneToMany(() => GiftItem, (gift) => gift.collection)
    items: GiftItem[];

    @CreateDateColumn()
    createdAt: string;

    @UpdateDateColumn()
    updatedAt: string;
}