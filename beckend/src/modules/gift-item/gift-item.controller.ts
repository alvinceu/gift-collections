import { Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GiftItemService } from './gift-item.service';
import { CreateGiftItemDto } from './dto/create-gift-item.dto';
import { UpdateGiftItemDto } from './dto/update-gift-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CollectionItemsAuthorGuard } from '../../common/guards/collection-items-author.guard';

@ApiTags('gift-items')
@Controller('collections/:collectionId/items')
export class GiftItemController {
  constructor(private readonly giftItemService: GiftItemService) {}

  @Post()
  @UseGuards(JwtAuthGuard, CollectionItemsAuthorGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавить подарок в коллекцию' })
  @ApiResponse({ status: 201, description: 'Подарок добавлен' })
  @ApiResponse({ status: 403, description: 'Нет прав (не автор коллекции)' })
  @ApiResponse({ status: 404, description: 'Коллекция не найдена' })
  create(
    @Param('collectionId') collectionId: string,
    @Body() dto: CreateGiftItemDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.giftItemService.create(collectionId, dto, user.id);
  }

  @Put(':itemId')
  @UseGuards(JwtAuthGuard, CollectionItemsAuthorGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить подарок' })
  @ApiResponse({ status: 200, description: 'Подарок обновлён' })
  @ApiResponse({ status: 403, description: 'Нет прав (не автор коллекции)' })
  @ApiResponse({ status: 404, description: 'Подарок или коллекция не найдены' })
  update(
    @Param('collectionId') collectionId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateGiftItemDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.giftItemService.update(collectionId, itemId, dto, user.id);
  }

  @Delete(':itemId')
  @UseGuards(JwtAuthGuard, CollectionItemsAuthorGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить подарок из коллекции' })
  @ApiResponse({ status: 200, description: 'Подарок удалён' })
  @ApiResponse({ status: 403, description: 'Нет прав (не автор коллекции)' })
  @ApiResponse({ status: 404, description: 'Подарок или коллекция не найдены' })
  delete(
    @Param('collectionId') collectionId: string,
    @Param('itemId') itemId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.giftItemService.delete(collectionId, itemId, user.id);
  }
}
