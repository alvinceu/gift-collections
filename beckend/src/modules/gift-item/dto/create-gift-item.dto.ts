import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateGiftItemDto {
  @ApiProperty({ example: 'Беспроводные наушники' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'https://example.com/headphones.jpg' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 4999.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'RUB', enum: ['RUB', 'USD', 'EUR'] })
  @IsIn(['RUB', 'USD', 'EUR'])
  currency: string;

  @ApiProperty({ example: 'Отличный звук', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: ['техника', 'музыка'], type: [String], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: 'https://shop.example.com/headphones' })
  @IsString()
  @IsOptional()
  link?: string;
}
