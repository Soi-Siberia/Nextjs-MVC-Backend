import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from 'src/decorator/cusommize';
import { UserRefDto } from 'src/common/dto/user-ref.dto';
import { IUser } from 'src/users/users.interface';

@Controller('jobs')
export class JobsController {

  constructor(private readonly jobsService: JobsService) { }

  @Post()
  @ResponseMessage('Create new Job') // Custom response message
  create(@Body() createJobDto: CreateJobDto, @User() user: UserRefDto) {
    console.log('createJobDto ==> ', createJobDto);
    return this.jobsService.create(createJobDto, user);
  }

  @Get()
  @Public()
  findAll(@Query('current') currentPage: number, @Query('pageSize') limit: number, @Query() query: any) {
    return this.jobsService.findAll(currentPage, limit, query);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Get a job by ID')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a job')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user: UserRefDto) {
    console.log('updateJobDto ==> ', updateJobDto);
    return this.jobsService.update(id, updateJobDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a job')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.jobsService.remove(id, user);
  }
}
