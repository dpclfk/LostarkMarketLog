import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AdminDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Length(2, 20)
  nickname: string;
}
