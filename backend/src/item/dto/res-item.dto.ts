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

export class SubCategoryItem {
  @ApiProperty()
  Code: number;

  @ApiProperty()
  CodeName: string;
}

// 주 카테고리 아이템 타입을 정의합니다.
export class CategoryItem {
  @ApiProperty({ type: [SubCategoryItem] })
  Subs: SubCategoryItem[];

  @ApiProperty()
  Code: number;

  @ApiProperty()
  CodeName: string;
}

// 전체 응답(response) 객체의 타입을 정의합니다.
export class CategoryCode {
  @ApiProperty({ type: [CategoryItem] })
  market_category: CategoryItem[];

  @ApiProperty({ type: [CategoryItem] })
  auction_category: CategoryItem[];
}

export class ItemCheck {
  @ApiProperty()
  name: string;

  @ApiProperty()
  icon: string;

  @ApiPropertyOptional()
  itemCode?: number;

  @ApiProperty()
  grade: string;
}
