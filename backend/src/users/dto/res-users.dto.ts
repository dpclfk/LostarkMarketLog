import { ApiProperty } from '@nestjs/swagger';

export class resProfileDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nickname: string;
}
