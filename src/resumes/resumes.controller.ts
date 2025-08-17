import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/cusommize';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }

  @Post()
  @ResponseMessage('Create a new resume')
  create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    return this.resumesService.create(createResumeDto, user);
  }

  @Post('by-user')
  @ResponseMessage('Get Resumes by User')
  byUser(@User() user: IUser) {
    return this.resumesService.byUser(user);
  }


  @Get()
  @ResponseMessage('Fetch all resumes with paginate')
  findAll(@Query('page') currentPage: number, @Query('limit') limit: number, @Query() query: any) {
    return this.resumesService.findAll(currentPage, limit, query);
  }

  @Get(':id')
  @ResponseMessage('Fetch a resume by id')
  findOne(@Param('id') id: string) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    return this.resumesService.findOne(id).then(resume => {
      if (!resume) {
        throw new BadRequestException(`Resume with ID ${id} not found`);
      }
      return resume;
    }).catch(err => {
      throw new BadRequestException(`Error fetching resume: ${err.message}`);
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('status') status: string, @User() user: IUser) {
    return this.resumesService.update(id, status, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
