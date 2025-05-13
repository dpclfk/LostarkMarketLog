import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { resProfileDto } from './dto/res-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '프로필',
    description: '유저의 프로필(유저번호와 닉네임)',
  })
  @ApiResponse({
    status: 200,
    type: [resProfileDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async profile(@Request() req: any) {
    const { id, nickname }: resProfileDto = req.user;
    return { id, nickname };
  }
}
