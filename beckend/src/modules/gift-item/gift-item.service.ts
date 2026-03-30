import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GiftItem } from '../../models/giftitem.entity';
import { CollectionService } from '../collection/collection.service';
import { TagService } from '../tag/tag.service';
import { CreateGiftItemDto } from './dto/create-gift-item.dto';
import { UpdateGiftItemDto } from './dto/update-gift-item.dto';

@Injectable()
export class GiftItemService {
  constructor(
    @InjectRepository(GiftItem)
    private readonly giftItemRepository: Repository<GiftItem>,
    private readonly collectionService: CollectionService,
    private readonly tagService: TagService,
  ) {}

  async create(collectionId: string, dto: CreateGiftItemDto, userId: string) {
    const collection = await this.collectionService.findById(collectionId);

    const tags = await this.tagService.findOrCreateMany(dto.tags || []);

    const item = this.giftItemRepository.create({
      title: dto.title,
      image: dto.image || '',
      price: dto.price,
      currency: dto.currency as any,
      description: dto.description || '',
      tags,
      link: dto.link || '',
      collectionId,
    });

    const saved = await this.giftItemRepository.save(item);
    return this.toResponse(saved);
  }

  async update(collectionId: string, itemId: string, dto: UpdateGiftItemDto, userId: string) {
    const collection = await this.collectionService.findById(collectionId);

    const item = await this.giftItemRepository.findOne({
      where: { id: itemId, collectionId },
      relations: ['tags'],
    });

    if (!item) {
      throw new NotFoundException('Подарок не найден');
    }

    if (dto.title !== undefined) item.title = dto.title;
    if (dto.image !== undefined) item.image = dto.image;
    if (dto.price !== undefined) item.price = dto.price;
    if (dto.currency !== undefined) item.currency = dto.currency as any;
    if (dto.description !== undefined) item.description = dto.description;
    if (dto.link !== undefined) item.link = dto.link;
    if (dto.tags !== undefined) {
      item.tags = await this.tagService.findOrCreateMany(dto.tags);
    }

    const saved = await this.giftItemRepository.save(item);
    return this.toResponse(saved);
  }

  async delete(collectionId: string, itemId: string, userId: string) {
    const collection = await this.collectionService.findById(collectionId);

    const item = await this.giftItemRepository.findOne({
      where: { id: itemId, collectionId },
    });

    if (!item) {
      throw new NotFoundException('Подарок не найден');
    }

    await this.giftItemRepository.remove(item);
  }

  private toResponse(item: GiftItem) {
    return {
      id: item.id,
      title: item.title,
      image: item.image,
      price: Number(item.price),
      currency: item.currency,
      description: item.description,
      tags: (item.tags || []).map((t) => t.name),
      link: item.link,
      createdAt: item.createdAt,
    };
  }
}
