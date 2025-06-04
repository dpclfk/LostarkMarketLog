import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, ItemCheckDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import {
  CategoryCode,
  getAllItemsDto,
  getItemDto,
  ItemCheck,
} from './dto/res-item.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @ApiOperation({
    summary: 'DB의 모든아이템 최신가격',
    description: 'DB에 저장되어있는 모든아이템의 가장 최신가격입니다.',
  })
  @ApiResponse({
    status: 200,
    type: [getAllItemsDto],
  })
  @Get()
  async findAll() {
    return await this.itemService.findAll();
  }

  @ApiOperation({
    summary: '카테고리를 가져옵니다.',
    description: '카테고리 목록을 가져옵니다. 아이템 추가할때 필요합니다.',
  })
  @ApiResponse({
    status: 200,
    type: CategoryCode,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('category')
  async category() {
    return await this.itemService.category();
  }

  @ApiOperation({
    summary: '특정아이템의 기록된 모든 가격들',
    description: 'DB에 저장되어있는 특정아이템의 기록된 모든가격입니다.',
  })
  @ApiResponse({
    status: 200,
    type: getItemDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.itemService.findOne(+id);
  }

  @ApiOperation({
    summary: 'DB에 저장',
    description: 'POST /check에서 응답된 내용을 기반으로 저장합니다.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, AdminGuard)
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
    type: [ItemCheck],
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('check')
  async check(@Body() itemCheckDto: ItemCheckDto) {
    return await this.itemService.check(itemCheckDto);
  }

  @ApiOperation({
    summary: 'MySQL 수정하기',
    description: 'MySQL에서 잘못된값을 수정합니다.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return await this.itemService.update(+id, updateItemDto);
  }

  @ApiOperation({
    summary: 'MySQL에서 완전삭제',
    description:
      'MySQL에서 완전삭제합니다. 더이상 최신가격 업데이트 및 값이 나오는것을 원하지 않을경우 삭제해주세요. MongoDB값은 삭제하지 않습니다.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.itemService.remove(+id);
  }
}
