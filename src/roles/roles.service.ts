import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { SoftDeleteModel } from 'mongoose-delete'; // Import SoftDeleteModel if you are using soft delete
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema'; // Adjust the import path as necessary
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()

export class RolesService {

  constructor(
    @InjectModel(Role.name) private rolesModule: SoftDeleteModel<Role>
  ) { }



  async create(createRoleDto: CreateRoleDto, user: IUser) {
    const { name } = createRoleDto

    const exit = await this.rolesModule.findOne({ name })
    if (exit) {
      throw new BadRequestException("Role đã tồn tại")
    }

    const creareRole = await this.rolesModule.create({
      ...createRoleDto,
      createdAt: new Date,
      createdBy: {
        _id: user._id,
        email: user.mail
      }
    })

    return {
      _id: creareRole.id,
      createBy: creareRole.createdBy
    };
  }

  async findAll(currentPage: number, limit: number, query: any) {
    const { filter, projection, population, sort } = aqp(query);
    delete filter.page;
    delete filter.limit;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;


    const totalItems = (await this.rolesModule.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.rolesModule.find(filter)
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
      throw new BadRequestException("ID không hợp lệ")
    }

    return this.rolesModule.findById(id).populate({
      path: "permissions",
      select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 }
    }).then(result => {
      if (!result) {
        throw new NotFoundException("Không tìm thấy role")
      }
      return result
    }).catch(err => {
      console.error(`Find role by id failed: ${err.message}`, err.stack);
      throw new InternalServerErrorException("Có lỗi xảy ra khi tìm role");
    });
  }


  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    console.log("===> check update data: ", updateRoleDto)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException("id không đúng định dạng")
    }

    // if (updateRoleDto.name) {
    //   const exists = await this.rolesModule.findOne({
    //     name: updateRoleDto.name,
    //     _id: { $ne: id }
    //   })

    //   if (exists) {
    //     throw new BadRequestException("Name Role đã tồn lại")
    //   }
    // }

    const updateRole = await this.rolesModule.updateOne(
      {
        _id: id,
      },
      {
        $set:
        {
          ...updateRoleDto,
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


    const roleDelte = await this.rolesModule.findById(id)
    if (roleDelte.name === "ADMIN") {
      throw new BadRequestException("Không thể xóa Role Admin")
    }

    // Bước 1: Cập nhật deletedBy
    await this.rolesModule.updateOne(
      { _id: id, deleted: false },
      {
        deletedBy: {
          _id: user._id,
          name: user.name,
        },
      }
    );

    // Bước 2: Gọi xoá mềm từ plugin mongoose-delete

    const deleted = await this.rolesModule.delete(
      { _id: id },
    );

    if (deleted.deletedCount === 0) {
      throw new NotFoundException(`Công ty với ID ${id} không tồn tại hoặc đã bị xoá`);
    }

    return { message: `Công ty với ID ${id} đã xoá thành công` };
  }



}
