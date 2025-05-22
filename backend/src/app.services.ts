import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { RegisterDto } from './auth/dto/register-dto';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}
  async onModuleInit() {
    const registerDto: RegisterDto = {
      email: this.configService.get<string>('ADMIN_EMAIL'),
      password: this.configService.get<string>('ADMIN_PASSWORD'),
      nickname: this.configService.get<string>('ADMIN_NICKNAME'),
    };

    await this.authService.addFirstAdmin(registerDto);
  }
}
