import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, ItemCheckDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: 'DB의 모든아이템 최신가격',
    description: 'DB에 저장되어있는 모든아이템의 가장 최신가격입니다.',
  })
  @Get()
  async findAll() {
    return await this.itemService.findAll();
  }

  @ApiOperation({
    summary: '특정아이템의 기록된 모든 가격들',
    description: 'DB에 저장되어있는 특정아이템의 기록된 모든가격입니다.',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.itemService.findOne(+id);
  }

  @ApiOperation({
    summary: 'DB에 저장',
    description: 'POST /check에서 응답된 내용을 기반으로 저장합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createItemDto: CreateItemDto) {
    return await this.itemService.create(createItemDto);
  }

  @ApiOperation({
    summary: '실제 데이터 체크',
    description: 'Open API에서 실제 데이터가 있는지 확인합니다.',
  })
  @ApiCreatedResponse({
    description: '아이템이 실제로 있는 경우 입니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('check')
  async check(@Body() itemCheckDto: ItemCheckDto) {
    return await this.itemService.check(itemCheckDto);
  }
  @ApiOperation({
    summary: 'MySQL 수정하기',
    description: 'MySQL에서 잘못된값을 수정합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return await this.itemService.update(+id, updateItemDto);
  }

  @ApiOperation({
    summary: 'MySQL에서 완전삭제',
    description:
      'MySQL에서 완전삭제합니다. 더이상 최신가격 업데이트 및 값이 나오는것을 원하지 않을경우 삭제해주세요. MongoDB값은 삭제하지 않습니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.itemService.remove(+id);
  }

  // 테스트용
}
