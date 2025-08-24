import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { Permission } from './schemas/permission.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete'; // Import SoftDeleteModel if you are using soft delete
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {

  constructor(
    @InjectModel(Permission.name) private permissionModel: SoftDeleteModel<Permission>
  ) { }

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { apiPath, method } = createPermissionDto;
    const existed = await this.permissionModel.findOne({ apiPath, method });
    if (existed) {
      throw new BadRequestException(`Permission with apiPath: ${apiPath} and method: ${method} already exists.`);
    }

    const created = await this.permissionModel.create({
      ...createPermissionDto,
      createdAt: new Date(),
      createdBy: {
        _id: user._id, // Assuming createdBy is passed in the DTO
        email: user.mail, // Assuming createdBy has a name field
      },
    });

    return {
      _id: created._id,
      createdAt: created.createdAt,
    }
  }

  async findAll(currentPage: number, limit: number, query: any) {
    const { filter, projection, population, sort } = aqp(query);
    delete filter.page;
    delete filter.limit;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;


    const totalItems = (await this.permissionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.permissionModel.find(filter)
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
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    return this.permissionModel.findById(id).then(permission => {
      if (!permission) {
        throw new BadRequestException('Permission not found')
      };
      return permission;
    }).catch(err => {
      throw new BadRequestException(`Permission not found`);
    })
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
    const updatedPermission = await this.permissionModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          ...updatePermissionDto,
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id, // Assuming updatedBy is passed in the DTO
            email: user.mail, // Assuming updatedBy has a name field
          },
        }
      }
    )
    return updatedPermission;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`)
    };

    try {
      const result = await this.permissionModel.findByIdAndUpdate(
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
        throw new BadRequestException("Không thể xóa job");
      }

      return result;
    } catch (e) {
      throw new BadRequestException(`Error deleting job: ${e.message}`);
    }



  }
}
