import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

// export class auctionsResDto {
//   @IsString()
//   @IsNotEmpty()
//   @ApiProperty()
//   name: string;

//   @IsNumber()
//   @IsNotEmpty()
//   @Min(10000)
//   @ApiProperty()
//   icon: number;
// }
// export class markets extends auctionsResDto {
//   @IsNumber()
//   @IsNotEmpty()
//   @ApiProperty()
//   img: string;
// }

export class resItemDto {
  @ApiProperty()
  name: string;

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
  icon: string;

  @ApiProperty()
  id: number;
}

export class getItemDto {
  @ApiProperty({ type: [resItemDto] })
  item: resItemDto[];

  @ApiProperty()
  icon: string;
}
