import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from '../../models/collection.entity';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { CollectionResolver } from './graphql/collection.resolver';
import { TagModule } from '../tag/tag.module';
import { CollectionAuthorGuard } from '../../common/guards/collection-author.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Collection]), TagModule],
  providers: [CollectionService, CollectionResolver, CollectionAuthorGuard],
  controllers: [CollectionController],
  exports: [CollectionService],
})
export class CollectionModule {}
