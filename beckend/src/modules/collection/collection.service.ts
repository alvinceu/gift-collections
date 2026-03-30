import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from '../../models/collection.entity';
import { TagService } from '../tag/tag.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    private readonly tagService: TagService,
  ) {}

  async findAll(search?: string, tagNames?: string[]) {
    const qb = this.collectionRepository
      .createQueryBuilder('collection')
      .leftJoinAndSelect('collection.tags', 'tag')
      .leftJoinAndSelect('collection.items', 'item')
      .leftJoinAndSelect('item.tags', 'itemTag');

    if (search) {
      qb.andWhere('collection.title ILIKE :search', { search: `%${search}%` });
    }

    if (tagNames && tagNames.length > 0) {
      qb.andWhere('tag.name IN (:...tagNames)', { tagNames });
    }

    qb.orderBy('collection.createdAt', 'DESC');

    const collections = await qb.getMany();
    return collections.map((c) => this.toResponse(c));
  }

  async findById(id: string) {
    const collection = await this.collectionRepository.findOne({
      where: { id },
      relations: ['tags', 'items', 'items.tags'],
    });

    if (!collection) {
      throw new NotFoundException('Коллекция не найдена');
    }

    return collection;
  }

  async findOne(id: string) {
    const collection = await this.findById(id);
    return this.toResponse(collection);
  }

  async create(dto: CreateCollectionDto, user: { id: string; name: string }) {
    const tags = await this.tagService.findOrCreateMany(dto.tags || []);

    const collection = this.collectionRepository.create({
      title: dto.title,
      description: dto.description || '',
      coverImage: dto.coverImage || '',
      authorId: user.id,
      authorName: user.name,
      tags,
    });

    const saved = await this.collectionRepository.save(collection);
    return this.toResponse(saved);
  }

  async update(id: string, dto: UpdateCollectionDto, userId: string) {
    const collection = await this.findById(id);

    if (dto.title !== undefined) collection.title = dto.title;
    if (dto.description !== undefined) collection.description = dto.description;
    if (dto.coverImage !== undefined) collection.coverImage = dto.coverImage;
    if (dto.tags !== undefined) {
      collection.tags = await this.tagService.findOrCreateMany(dto.tags);
    }

    const saved = await this.collectionRepository.save(collection);
    return this.toResponse(saved);
  }

  async delete(id: string, userId: string) {
    const collection = await this.findById(id);
    await this.collectionRepository.remove(collection);
  }

  private toResponse(collection: Collection) {
    return {
      id: collection.id,
      title: collection.title,
      description: collection.description,
      authorId: collection.authorId,
      authorName: collection.authorName,
      coverImage: collection.coverImage,
      tags: (collection.tags || []).map((t) => t.name),
      items: (collection.items || []).map((item) => ({
        id: item.id,
        title: item.title,
        image: item.image,
        price: Number(item.price),
        currency: item.currency,
        description: item.description,
        tags: (item.tags || []).map((t) => t.name),
        link: item.link,
        createdAt: item.createdAt,
      })),
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
    };
  }
}
