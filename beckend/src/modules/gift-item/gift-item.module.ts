import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GiftItem } from '../../models/giftitem.entity';
import { GiftItemService } from './gift-item.service';
import { GiftItemController } from './gift-item.controller';
import { GiftItemResolver } from './graphql/gift-item.resolver';
import { CollectionModule } from '../collection/collection.module';
import { TagModule } from '../tag/tag.module';
import { CollectionItemsAuthorGuard } from '../../common/guards/collection-items-author.guard';

@Module({
  imports: [TypeOrmModule.forFeature([GiftItem]), CollectionModule, TagModule],
  providers: [GiftItemService, GiftItemResolver, CollectionItemsAuthorGuard],
  controllers: [GiftItemController],
})
export class GiftItemModule {}
