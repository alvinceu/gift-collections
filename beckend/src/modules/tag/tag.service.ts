import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tag } from '../../models/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find({ order: { name: 'ASC' } });
  }

  async findOrCreateMany(names: string[]): Promise<Tag[]> {
    if (!names || names.length === 0) return [];

    const normalized = [...new Set(names.map((n) => n.trim().toLowerCase()))];

    const existing = await this.tagRepository.find({
      where: { name: In(normalized) },
    });

    const existingNames = new Set(existing.map((t) => t.name));
    const missing = normalized.filter((n) => !existingNames.has(n));

    if (missing.length > 0) {
      const newTags = this.tagRepository.create(missing.map((name) => ({ name })));
      const saved = await this.tagRepository.save(newTags);
      return [...existing, ...saved];
    }

    return existing;
  }

  async create(name: string): Promise<Tag> {
    const normalized = name.trim().toLowerCase();
    const existing = await this.tagRepository.findOne({ where: { name: normalized } });
    if (existing) return existing;

    const tag = this.tagRepository.create({ name: normalized });
    return this.tagRepository.save(tag);
  }

  async remove(id: string): Promise<void> {
    await this.tagRepository.delete(id);
  }
}
