import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from 'src/users/users.interface';
import { Resume } from './schemas/resume.schema';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class ResumesService {


  constructor(
    @InjectModel(Resume.name) private ResumeModel: SoftDeleteModel<Resume>
  ) { }



  create(createResumeDto: CreateResumeDto, user: IUser) {
    return this.ResumeModel.create({
      ...createResumeDto,
      email: user.mail, // Assuming the user object has an email property
      userId: user._id, // Assuming the user object has an id property
      status: 'PENDING', // Default status
      history: [{
        status: 'PENDING',
        createdBy: {
          _id: user._id,
          email: user.mail
        },
        createdAt: new Date()
      }],
      // If you want to add more fields, you can do it here
      createdBy: {
        _id: user._id, // Assuming createdBy is passed in the DTO
        email: user.mail, // Assuming createdBy has a name field
      }
    })
  }

  async findAll(currentPage, limit, query) {
    const { filter, projection, population, sort } = aqp(query);
    delete filter.page;
    delete filter.limit;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;


    const totalItems = (await this.ResumeModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.ResumeModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection as any)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  findOne(id: string) {
    return this.ResumeModel.findById(id).exec();
  }

  update(id: string, status: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid resume ID format');
    }
    return this.ResumeModel.updateOne(
      {
        _id: id,
        deleted: false // Ensure we are not updating a deleted resume
      },
      {
        $set: {
          status: status,
          updatedBy: {
            _id: user._id,
            name: user.name
          },
          updatedAt: new Date(),
        },
        $push: {
          history: {
            status: status,
            updatedAt: new Date(),
            updatedBy: {
              _id: user._id,
              name: user.name
            }
          }
        }
      }
    )
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid resume ID format');
    }

    await this.ResumeModel.findOne(
      {
        _id: id,
        deleted: false // Ensure we are not deleting a resume that is already deleted
      },
      {
        deletedBy: {
          _id: user._id,
          name: user.name
        }
      }
    )
    const resule = await this.ResumeModel.delete(
      { _id: id }
    )

    if (resule.deletedCount === 0) {
      throw new NotFoundException(`Công ty với ID ${id} không tồn tại hoặc đã bị xoá`);
    }

    return { message: `Công ty với ID ${id} đã xoá thành công` };
  }

  byUser(user: IUser) {

    return this.ResumeModel.find({ userId: user._id, deleted: false })
  }

}
