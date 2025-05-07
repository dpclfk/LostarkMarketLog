import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { LoginDto, RegisterDto } from './dto/register-dto';
import { AdminDto } from './dto/admin-dto';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AdminGuard } from './admin.guard';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Guards로인해 LocalAuthGuard에서 유저를찾고, 찾으면 값을 req에 넣음
  // 로그인
  // passthrough는 return값을 무시하는걸 막아줌
  @ApiOperation({
    summary: '로그인',
    description: '아이디는 이메일 형식이면가능, 비밀번호는 8자이상 60자 이하',
  })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto, // swagger때문에 넣어둠
  ) {
    const { access_token, refresh_token } = await this.authService.login(
      req.user,
    );
    res.cookie('refresh_token', refresh_token, {
      httpOnly: false, // thunder로 테스트중일때만 false로 해놓기
      secure: false, // thunder로 테스트중일때만 false로 해놓기
      sameSite: 'none',
      path: '/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });
    return access_token;
  }

  // 회원가입
  // 로그인 안되어있을때만 하려했는데 굳이 필요없다고 느낌
  @ApiOperation({
    summary: '회원가입',
    description:
      '아이디는 이메일 형식이면가능, 비밀번호는 8자이상 60자 이하, 닉네임은 2자이상 20자 이하',
  })
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  // 특정유저에 어드민 권한 부여
  // 권한 수정이라 Patch로 사용
  @ApiOperation({
    summary: '어드민 권한 부여',
    description: '닉네임은 2자이상 20자 이하',
  })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('/admin')
  async adminAuth(@Body() adminDto: AdminDto) {
    await this.authService.adminAuth(adminDto);
    return '어드민 권한 부여 완료';
  }

  // 특정유저에 어드민 권한 제거
  // 권한 수정이라 Patch로 사용
  @ApiOperation({
    summary: '어드민 권한 제거',
    description: '닉네임은 2자이상 20자 이하',
  })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('/admin-remove')
  async adminRemove(@Body() adminDto: AdminDto) {
    await this.authService.adminRemove(adminDto);
    return '어드민 권한 제거 완료';
  }

  // 가드에 막히면 여기서 리프레시 토큰 확인
  // jwtguard에서 막힐거라 가드 없음
  @ApiOperation({
    summary: '엑세스토큰 만료시 재발급',
    description:
      '엑세스토큰 만료시 재발급, 쿠키값 사용하니 with credentials 설정 필요',
  })
  @Get('/refresh')
  async refresh(@Request() req) {
    const refresh_token: string = req.cookies['refresh_token']; // 쿠키에서 리프레시 토큰 가져오기
    return await this.authService.refresh(refresh_token);
  }

  // 리프레시 토큰만 삭제
  // 리프레시 토큰 삭제작업인데 가드있을경우 엑세스토큰을 추가해야 로그아웃이 돼서 가드없음
  @ApiOperation({
    summary: '로그아웃',
    description:
      '쿠키에 저장되어있는 리프레시토큰 삭제, 쿠키값 사용하니 with credentials 설정 필요',
  })
  @Delete('/logout')
  async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    const refresh_token: string = req.cookies['refresh_token']; // 쿠키에서 리프레시 토큰 가져오기
    if (!refresh_token) {
      throw new UnauthorizedException('이미 로그아웃되었습니다.');
    }
    await this.authService.logout(refresh_token);
    res.clearCookie('refresh_token', {
      httpOnly: false, // thunder로 테스트중일때만 false로 해놓기
      secure: false, // thunder로 테스트중일때만 false로 해놓기
      sameSite: 'none',
      path: '/auth',
    });
    return '로그아웃 완료';
  }
}
