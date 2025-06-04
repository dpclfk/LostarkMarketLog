import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
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
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { resLoginDto } from './dto/res-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Guards로인해 LocalAuthGuard에서 유저를찾고, 찾으면 값을 req에 넣음
  // 로그인
  // passthrough는 return값을 무시하는걸 막아줌
  @ApiOperation({
    summary: '로그인',
    description:
      '아이디는 이메일 형식이면가능, 비밀번호는 8자이상 60자 이하, 성공시 로그인처리되어 자동으로 쿠키에 리프레시토큰이 저장됩니다.',
  })
  @ApiResponse({
    status: 201,
    type: resLoginDto,
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
      httpOnly: true, // thunder로 테스트중일때만 false로 해놓기
      secure: true, // thunder로 테스트중일때만 false로 해놓기
      sameSite: 'none',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });
    return { access_token: access_token };
  }

  // 회원가입
  // 로그인 안되어있을때만 하려했는데 굳이 필요없다고 느낌
  @ApiOperation({
    summary: '회원가입',
    description:
      '아이디는 이메일 형식이면가능, 비밀번호는 8자이상 60자 이하, 닉네임은 2자이상 20자 이하 특수문자 불가능',
  })
  @ApiResponse({
    status: 201,
    schema: {
      type: 'string',
      example: '회원가입 완료',
    },
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
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: '어드민 권한 부여 완료',
    },
  })
  @ApiBearerAuth('access-token')
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
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: '어드민 권한 제거 완료',
    },
  })
  @ApiBearerAuth('access-token')
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
  @ApiResponse({
    status: 200,
    type: resLoginDto,
  })
  @ApiCookieAuth()
  @Get('/refresh')
  async refresh(@Request() req) {
    const refresh_token: string = req.cookies['refresh_token']; // 쿠키에서 리프레시 토큰 가져오기
    const access_token = await this.authService.refresh(refresh_token);
    return { access_token: access_token };
  }

  // 리프레시 토큰만 삭제
  // 리프레시 토큰 삭제작업인데 가드있을경우 엑세스토큰을 추가해야 로그아웃이 돼서 가드없음
  @ApiOperation({
    summary: '로그아웃',
    description:
      '쿠키에 저장되어있는 리프레시토큰 삭제, 쿠키값 사용하니 with credentials 설정 필요',
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: '로그아웃 완료',
    },
  })
  @Delete('/logout')
  async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    const refresh_token: string = req.cookies['refresh_token']; // 쿠키에서 리프레시 토큰 가져오기
    if (!refresh_token) {
      throw new UnauthorizedException('이미 로그아웃되었습니다.');
    }
    await this.authService.logout(refresh_token);
    res.clearCookie('refresh_token', {
      httpOnly: true, // thunder로 테스트중일때만 false로 해놓기
      secure: true, // thunder로 테스트중일때만 false로 해놓기
      sameSite: 'none',
      path: '/api/auth',
    });
    return '로그아웃 완료';
  }

  @ApiOperation({
    summary: '어드민 확인',
    description: '로그인 되어있는 사람이 어드민인지 확인합니다.',
  })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'string',
      example: '어드민 입니다.',
    },
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/admin')
  async adminCheck() {
    return '어드민 입니다.';
  }

  @ApiOperation({
    summary: '네이버 로그인 유저 체크',
    description:
      '이미 회원가입 되어있는 사람은 Duplicate, 아니면 이메일 출력, 성공시 로그인처리되어 자동으로 쿠키에 리프레시토큰이 저장됩니다.',
  })
  @ApiResponse({
    status: 201,
    type: resLoginDto,
  })
  @Get('/naver-oauth')
  async naverOAuth(
    @Query() query: { code: string; state: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const naverUserInfo = await this.authService.naverOAuth(
      query.code,
      query.state,
    );
    const { access_token, refresh_token } =
      await this.authService.login(naverUserInfo);
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true, // thunder로 테스트중일때만 false로 해놓기
      secure: true, // thunder로 테스트중일때만 false로 해놓기
      sameSite: 'none',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });
    return { access_token: access_token };
  }
}
