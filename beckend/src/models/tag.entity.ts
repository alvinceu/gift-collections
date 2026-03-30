import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from './collection.entity';
import { GiftItem } from './giftitem.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Collection, (collection) => collection.tags)
  collections: Collection[];

  @ManyToMany(() => GiftItem, (giftItem) => giftItem.tags)
  giftItems: GiftItem[];
}
