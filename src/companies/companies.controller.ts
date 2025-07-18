import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ResponseMessage, User } from 'src/decorator/cusommize';
import { IUser } from 'src/users/users.interface';


@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    // console.log("===> check user: ", user);
    return this.companiesService.create(createCompanyDto, user);
  }

  @Get()
  @ResponseMessage("Get all companies")
  findAll(@Query('page') currentPage: number, @Query('limit') limit: number, @Query() query: any) {
    // console.log("===> check query: ", query);
    return this.companiesService.findAll(currentPage, limit, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @User() user: IUser) {
    // console.log("===> check updateCompanyDto: ", updateCompanyDto);
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.companiesService.remove(id, user);
  }
}
