import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register-dto';
import { AdminDto } from './dto/admin-dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async hassPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(
      parseInt(this.configService.get<string>('SALT_ROUNDS')),
    );
    return await bcrypt.hash(password, salt);
  }

  private async matchPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // 첫 로그인할때만 비밀번호 확인함
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.login(username);
    if (await this.matchPassword(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.userId,
      isAdmin: user.isAdmin,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    registerDto.password = await this.hassPassword(registerDto.password);
    await this.usersService.register(registerDto);
    return '회원가입 완료';
  }

  async adminAuth(adminDto: AdminDto) {
    await this.usersService.adminAuth(adminDto);
  }

  async adminRemove(adminDto: AdminDto) {
    await this.usersService.adminRemove(adminDto);
  }
}
