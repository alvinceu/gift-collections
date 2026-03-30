import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CollectionAuthorGuard } from '../../common/guards/collection-author.guard';

@ApiTags('collections')
@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все коллекции' })
  @ApiQuery({ name: 'search', required: false, description: 'Поиск по названию' })
  @ApiQuery({ name: 'tags', required: false, description: 'Фильтр по тегам (через запятую)' })
  @ApiResponse({ status: 200, description: 'Список коллекций' })
  findAll(@Query('search') search?: string, @Query('tags') tags?: string) {
    const tagNames = tags ? tags.split(',').map((t) => t.trim().toLowerCase()) : undefined;
    return this.collectionService.findAll(search, tagNames);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить коллекцию по ID' })
  @ApiResponse({ status: 200, description: 'Коллекция' })
  @ApiResponse({ status: 404, description: 'Коллекция не найдена' })
  findOne(@Param('id') id: string) {
    return this.collectionService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать коллекцию' })
  @ApiResponse({ status: 201, description: 'Коллекция создана' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  create(
    @Body() dto: CreateCollectionDto,
    @CurrentUser() user: { id: string; name: string },
  ) {
    return this.collectionService.create(dto, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, CollectionAuthorGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить коллекцию' })
  @ApiResponse({ status: 200, description: 'Коллекция обновлена' })
  @ApiResponse({ status: 403, description: 'Нет прав (не автор)' })
  @ApiResponse({ status: 404, description: 'Коллекция не найдена' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCollectionDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.collectionService.update(id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, CollectionAuthorGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить коллекцию' })
  @ApiResponse({ status: 200, description: 'Коллекция удалена' })
  @ApiResponse({ status: 403, description: 'Нет прав (не автор)' })
  @ApiResponse({ status: 404, description: 'Коллекция не найдена' })
  delete(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.collectionService.delete(id, user.id);
  }
}
