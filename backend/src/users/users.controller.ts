import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { resProfileDto } from './dto/res-users.dto';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '프로필',
    description: '유저의 프로필(유저번호와 닉네임)',
  })
  @ApiResponse({
    status: 200,
    type: resProfileDto,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async profile(@Request() req: any) {
    const { id, nickname }: resProfileDto = req.user;
    return { id, nickname };
  }

  @ApiOperation({
    summary: '어드민이 아닌 유저리스트',
    description: '어드민이 아닌 유저 리스트를 가져옵니다.(유저번호와 닉네임)',
  })
  @ApiResponse({
    status: 200,
    type: [resProfileDto],
  })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/not-admin')
  async notAdminList() {
    return this.usersService.notAdminList();
  }

  @ApiOperation({
    summary: '어드민 유저리스트',
    description: '어드민이 유저 리스트를 가져옵니다.(유저번호와 닉네임)',
  })
  @ApiResponse({
    status: 200,
    type: [resProfileDto],
  })
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('/admin')
  async adminList() {
    return this.usersService.adminList();
  }
}
