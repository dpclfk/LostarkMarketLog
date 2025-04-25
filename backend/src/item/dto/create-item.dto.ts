import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ItemCheckDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  category: number;

  @IsBoolean()
  @Transform(({ value }) =>
    value === undefined || value === null || value === '' ? false : value,
  )
  @ApiProperty({ default: false })
  autcions: boolean = false;
}
export class CreateItemDto extends ItemCheckDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  img: string;
}
