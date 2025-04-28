import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class auctionsResDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(10000)
  @ApiProperty()
  icon: number;
}
export class markets extends auctionsResDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  img: string;
}
