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
      console.log(errors);
      if (errors[0].property === 'email') {
        throw new BadRequestException(Object.values(errors[0].constraints)[0]);
      } else if (errors[0].property === 'password') {
        throw new BadRequestException(Object.values(errors[0].constraints)[0]);
      }
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
