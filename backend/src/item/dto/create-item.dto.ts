import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Min,
  ValidateIf,
  ValidateNested,
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
    description: 'example에 있는 문자가 맨앞에 들어가 있어야함',
  })
  icon: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) =>
    value === undefined || value === '' ? null : value,
  )
  @ApiPropertyOptional()
  itemCode?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  grade: string;
}

export class AccessoryValueDto {
  @IsNumber()
  @IsNotEmpty()
  SecondOption: number;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}

export class AccessoryDto extends CreateItemDto {
  // 품질 70이래는 가치가 없어서 필요없음
  @IsNumber()
  @IsNotEmpty()
  @Min(70)
  quality: number;

  @ValidateNested()
  @Type(() => AccessoryValueDto)
  @IsNotEmpty()
  accessoryUpgrade1: AccessoryValueDto;

  // accessoryUpgrade1 있을 때만 가능
  @ValidateIf((o) => o.accessoryUpgrade1 !== undefined)
  @ValidateNested()
  @Type(() => AccessoryValueDto)
  accessoryUpgrade2?: AccessoryValueDto | null;

  // accessoryUpgrade2 있을 때만 가능
  @ValidateIf((o) => o.accessoryUpgrade2 !== undefined)
  @ValidateNested()
  @Type(() => AccessoryValueDto)
  accessoryUpgrade3?: AccessoryValueDto | null;

  // 3티어는 가치없어서 필요없음
  @IsNumber()
  @IsNotEmpty()
  @Min(4)
  itemTier: number;
}
