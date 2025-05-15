import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: '이메일 형식이 잘못되었습니다' })
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(40, {
    message: '이메일은 40자 이하여야 합니다.',
  })
  email: string;

  @IsString()
  @ApiProperty()
  @MaxLength(60, {
    message: '비밀번호는 60자 이하여야 합니다.',
  })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        '비밀번호는 최소 8자 이상이어야 하며, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다.',
    },
  )
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Length(2, 20, { message: '닉네임은 2자 이상, 20자 이하여야 합니다.' })
  @Matches(/^[A-Za-z0-9가-힣]*$/, {
    message: '닉네임은 한글, 알파벳, 숫자만 사용할 수 있습니다.',
  })
  nickname: string;
}
