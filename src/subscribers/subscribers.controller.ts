import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from 'src/users/users.interface';
import { Public, ResponseMessage, User } from 'src/decorator/cusommize';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) { }

  @Post()
  @ResponseMessage('Tạo mới subscriber')
  create(@Body() createSubscriberDto: CreateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.create(createSubscriberDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage('Lấy danh sách subscribers page')
  findAll(@Query('current') currentPage: number, @Query('pageSize') limit: number, @Query() query: any) {
    return this.subscribersService.findAll(currentPage, limit, query);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Lấy thông tin subscriber theo ID')
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật thông tin subscriber')
  update(@Param('id') id: string, @Body() updateSubscriberDto: UpdateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.update(id, updateSubscriberDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Xóa subscriber')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.subscribersService.remove(id, user);
  }
}
