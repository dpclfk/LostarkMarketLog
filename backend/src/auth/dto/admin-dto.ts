import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nickname: string;
}
