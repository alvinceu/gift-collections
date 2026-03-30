import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../../models/tag.entity';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { TagResolver } from './graphql/tag.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  providers: [TagService, TagResolver],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
