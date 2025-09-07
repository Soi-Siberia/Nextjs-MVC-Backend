import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { UserRefDto } from 'src/common/dto/user-ref.dto';
import { Job } from './schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete'; // Import SoftDeleteModel if you are using soft delete
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

@Injectable()

export class JobsService {

  constructor(@InjectModel(Job.name) private jobModel: SoftDeleteModel<Job>) { }


  async create(createJobDto: CreateJobDto, user: UserRefDto) {
    // Here you would typically save the job to the database
    // For demonstration, we will just return the job data along with the user information
    const newJob = await this.jobModel.create({
      name: createJobDto.name,
      skills: createJobDto.skills,
      company: {
        _id: createJobDto.company._id, // ép kiểu cho _id là ObjectId của mongoose
        name: createJobDto.company.name
      },
      salary: createJobDto.salary,
      quantity: createJobDto.quantity, //số lượng tuyển
      level: createJobDto.level,
      description: createJobDto.description,
      startDate: createJobDto.startDate,
      endDate: createJobDto.endDate,
      isActive: true, // mặc định là true
      createdBy: {
        _id: user._id, // ép kiểu cho _id là ObjectId của mongoose
        name: user.name
      },
      createdAt: new Date()
    })
    return {
      id: newJob._id,
      name: newJob.name,
      createdAt: newJob.createdAt
    };
  }

  async findAll(currentPage: number, limit: number, query: any) {
    const { filter, projection, population, sort } = aqp(query);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;


    const totalItems = (await this.jobModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.jobModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select('-password -__v')
      .exec()
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
    return this.jobModel.findById(id).then(job => {
      if (!job) {
        throw new BadRequestException('Job not found');
      }
      return job;
    }
    ).catch(err => {
      throw new BadRequestException(`Job not found`);
    })
  }

  update(id: string, updateJobDto: UpdateJobDto, user: UserRefDto) {

    return this.jobModel.updateOne(
      console.log('updateJobDto: ', updateJobDto),
      { _id: id },
      {
        $set: {
          ...updateJobDto,
          updatedBy: {
            _id: user._id, // ép kiểu cho _id là ObjectId của mongoose
            name: user.name
          },
          updatedAt: new Date()
        }
      }
    )
  }

  // remove(id: string, user: IUser) {
  //   return this.jobModel.delete({ _id: id }, {
  //     deletedBy: {
  //       _id: user._id, // Assuming the id is the user ID who is deleting the job
  //       name: user.name, // You might want to replace this with actual user info
  //     }
  //   }).then(result => {
  //     if (result.deletedCount === 0) {
  //       return `Đã phát sinh lỗi: Lỗi khi xóa công việc`;
  //     }
  //     return `Xóa công việc thành công`;
  //   })
  // }

  async remove(id: string, user: IUser) {
    try {
      const result = await this.jobModel.findByIdAndUpdate(
        id,
        {
          $set: {
            deleted: true, // Soft delete flag
            deletedAt: new Date(),
            deletedBy: {
              _id: user._id,
              name: user.name,
            }
          }
        },
        { new: true } // Trả về document sau khi update
      );

      if (!result) {
        return { status: 'error', message: 'Không tìm thấy công việc để xóa' };
      }

      return { status: 'success', message: 'Xóa công việc thành công', data: result };
    } catch (e) {
      throw new BadRequestException(`Error deleting job: ${e.message}`);
    }
  }
}
