import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все теги' })
  @ApiResponse({ status: 200, description: 'Список тегов' })
  findAll() {
    return this.tagService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать тег' })
  @ApiResponse({ status: 201, description: 'Тег создан' })
  create(@Body() dto: CreateTagDto) {
    return this.tagService.create(dto.name);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить тег' })
  @ApiResponse({ status: 200, description: 'Тег удалён' })
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }
}
