import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber } from './schemas/subscriber.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { IUser } from 'src/users/users.interface';
import { create } from 'domain';
import aqp from 'api-query-params';
import mongoose, { Mongoose } from 'mongoose';
import { ADMIN_ROLE } from 'src/databases/sample';
@Injectable()
export class SubscribersService {

  constructor(
    @InjectModel(Subscriber.name) private subscriberModel: SoftDeleteModel<Subscriber>
  ) { }



  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {

    try {
      const isExit = await this.subscriberModel.findOne({ email: createSubscriberDto.email });
      if (isExit) {
        throw new BadRequestException('Email đã tồn tại trong hệ thống');
      }

      const createSubscriber = await this.subscriberModel.create({
        ...createSubscriberDto,
        createdAt: new Date(),
        createdBy: {
          _id: user._id,
          email: user.mail
        }
      })
      return {
        _id: createSubscriber.id,
        createBy: createSubscriber.createdBy
      };
    } catch (e) {
      console.log("===> check error: ", e)
      throw new BadRequestException("Lỗi đã có lỗi xảy ra: Lỗi " + e.message);
    }
  }

  async findAll(currentPage: number, limit: number, query: any) {
    const { filter, projection, population, sort } = aqp(query);
    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;


    const totalItems = (await this.subscriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.subscriberModel.find(filter)
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Dữ liệu đầu vào không hợp lệ')
    }
    return this.subscriberModel.findById(id);
  }

  async update(id: string, updateSubscriberDto: UpdateSubscriberDto, user) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Dữ liệu đầu vào không hợp lệ')
    }

    const updateRole = await this.subscriberModel.updateOne(
      {
        _id: id,
      },
      {
        $set:
        {
          ...updateSubscriberDto,
          updatedBy: {
            _id: user._id,
            email: user.mail
          },
        }
      },
      { new: true }
    )

    if (!updateRole) {
      throw new BadRequestException("Role đã tồn tại or bị xóa")
    }

    return updateRole;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Dữ liệu đầu vào không hợp lệ')
    }

    // Bước 1: Cập nhật deletedBy
    await this.subscriberModel.updateOne(
      { _id: id, deleted: false },
      {
        deletedBy: {
          _id: user._id,
          name: user.name,
        },
      }
    );

    // Bước 2: Gọi xoá mềm từ plugin mongoose-delete

    const deleted = await this.subscriberModel.delete(
      { _id: id },
    );

    if (deleted.deletedCount === 0) {
      throw new NotFoundException(`Công ty với ID ${id} không tồn tại hoặc đã bị xoá`);
    }

    return { message: `Công ty với ID ${id} đã xoá thành công` };
  }
}
