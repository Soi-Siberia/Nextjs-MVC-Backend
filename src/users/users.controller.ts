import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }


  //C1
  // create(
  //   @Body("name") name: string,
  //   @Body("mail") mail: string,
  //   @Body("password") password: string,
  // ) {
  //   return this.usersService.create(name, mail, password);
  // }

  @Get(':all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':update')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete('deleteById')
  remove(@Query('id') id: string) {
    console.log("===> check ID: ", id);
    return this.usersService.remove(id);
  }
}
