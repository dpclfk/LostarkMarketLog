import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, ItemCheckDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @ApiOperation({
    summary: 'DB의 모든아이템 최신가격',
    description: 'DB에 저장되어있는 모든아이템의 가장 최신가격입니다.',
  })
  @Get()
  async findAll() {
    return await this.itemService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.itemService.findOne(+id);
  }

  @ApiOperation({
    summary: 'DB에 저장',
    description: 'POST /check에서 응답된 내용을 기반으로 저장합니다.',
  })
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
  @Post('check')
  async check(@Body() itemCheckDto: ItemCheckDto) {
    return await this.itemService.check(itemCheckDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(+id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }
}
