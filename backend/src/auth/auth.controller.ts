import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterDto } from './dto/register-dto';
import { AdminDto } from './dto/admin-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Guards로인해 LocalAuthGuard에서 유저를찾고, 찾으면 값을 req에 넣음
  // 로그인
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: any) {
    return await this.authService.login(req.user);
  }

  // 회원가입
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  // 어드민 권한 부여
  @Post('/admin')
  async adminAuth(@Body() adminDto: AdminDto) {
    await this.authService.adminAuth(adminDto);
    return '어드민 권한 부여 완료';
  }

  // 어드민 권한 부여
  @Post('/admin-remove')
  async adminRemove(@Body() adminDto: AdminDto) {
    await this.authService.adminRemove(adminDto);
    return '어드민 권한 제거 완료';
  }
}
