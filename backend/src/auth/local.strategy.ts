import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from './dto/register-dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<any> {
    const dto = plainToInstance(LoginDto, { email, password });
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new BadRequestException(
        '이메일 또는 비밀번호 형식이 잘못되었습니다',
      );
    }

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }
    return user;
  }
}
