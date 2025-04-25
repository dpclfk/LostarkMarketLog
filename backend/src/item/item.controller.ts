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
import { ApiOperation } from '@nestjs/swagger';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  findAll(@Query('test') QT: string) {
    return this.itemService.findAll(QT);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @ApiOperation({
    summary: 'DB에 저장',
    description: 'POST /check에서 응답된 내용을 기반으로 저장합니다.',
  })
  @Post()
  async create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @ApiOperation({
    summary: '실제 데이터 체크',
    description: 'Open API에서 실제 데이터가 있는지 확인합니다.',
  })
  @Post('check')
  async check(@Body() itemCheckDto: ItemCheckDto) {
    return this.itemService.check(itemCheckDto);
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
