import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Min,
} from 'class-validator';

export class ItemCheckDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(10000)
  @ApiProperty({ example: 10000 })
  category: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) =>
    value === undefined || value === null || value === '' ? false : value,
  )
  @ApiPropertyOptional({ default: false })
  auctions: boolean = false;
}
export class CreateItemDto extends ItemCheckDto {
  @IsUrl()
  @IsNotEmpty()
  @Matches(/^https:\/\/cdn-lostark\.game\.onstove\.com\//)
  @ApiProperty({
    example: 'https://cdn-lostark.game.onstove.com/',
    description: 'example에 있는 문자가 들어가 있어야함',
  })
  icon: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) =>
    value === undefined || value === '' ? null : value,
  )
  @ApiPropertyOptional()
  itemCode?: number;
}
