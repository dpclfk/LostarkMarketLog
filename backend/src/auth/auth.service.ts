import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register-dto';
import { AdminDto } from './dto/admin-dto';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async hassPassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt(
      parseInt(this.configService.get<string>('SALT_ROUNDS')),
    );
    return await bcrypt.hash(password, salt);
  }

  private async matchPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // 첫 로그인할때만 비밀번호 확인함
  async validateUser(email: string, password: string): Promise<any> {
    const user: Users = await this.usersService.login(email);
    if (!user) {
      return null;
    } else if (await this.matchPassword(password, user.password)) {
      const { password, ...result } = user;
      return result;
    } else {
      return null;
    }
  }

  async login(user: any) {
    const payload = {
      nickname: user.nickname,
      sub: user.id,
      isAdmin: user.admin,
    };

    const refresh_token: string = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION_TIME'),
    });

    // 암호화하여 리프레시 토큰 저장
    const hashed_refresh_token: string = await this.hassPassword(refresh_token);
    await this.usersService.addRefresh(+user.id, hashed_refresh_token);

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refresh_token,
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

  async refresh(refresh_token: string) {
    const payload = await this.jwtService.verify(refresh_token, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    const refresh: Users = await this.usersService.checkRefresh(payload.sub);

    // 로그인 안되어있으니 401 에러로
    if (!(await this.matchPassword(refresh_token, refresh.refresh))) {
      throw new UnauthorizedException('다시 로그인 해주세요');
    }

    // 액세스 토큰 재발급
    const new_access_token = this.jwtService.sign({
      nickname: payload.nickname,
      sub: payload.id,
      isAdmin: payload.isAdmin,
    });

    return new_access_token;
  }
  async logout(refresh_token: string) {
    const payload = await this.jwtService.verify(refresh_token, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    await this.usersService.logout(payload.sub);
  }
}
