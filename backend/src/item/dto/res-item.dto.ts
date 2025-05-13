import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class resItemDto {
  @ApiProperty()
  price: number;

  @ApiPropertyOptional()
  @IsOptional()
  comment?: string;

  @ApiProperty()
  date: Date;
}

export class getAllItemsDto extends resItemDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  id: number;

  @ApiProperty()
  grade: string;
}

export class getItemDto {
  @ApiProperty({ type: [resItemDto] })
  item: resItemDto[];

  @ApiProperty()
  name: string;

  @ApiProperty()
  icon: string;

  @ApiProperty()
  grade: string;
}
