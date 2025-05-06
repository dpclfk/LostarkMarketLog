import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  @Length(5, 40)
  email: string;

  @IsString()
  @ApiProperty()
  @Length(8, 60)
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Length(2, 20)
  nickname: string;
}
