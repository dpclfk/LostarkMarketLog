import { ApiProperty } from '@nestjs/swagger';

export class resLoginDto {
  @ApiProperty()
  access_token: string;
}
