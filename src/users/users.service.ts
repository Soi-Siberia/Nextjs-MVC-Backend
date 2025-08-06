import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, registerUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { mongo } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete'; // Import SoftDeleteModel if you are using soft delete
import { IUser } from './users.interface';
import { hashPassword } from '../common/utils/bcrypt.util'; // Import the hashPassword utility function
import aqp from 'api-query-params';

@Injectable()
export class UsersService {


  constructor(@InjectModel(User.name) private UserModel: SoftDeleteModel<User>) { }

  // isvalidPassword = async (password: string, hashedPassword: string) => {
  //   return await bcrypt.compare(password, hashedPassword);
  // }

  async create(createUserDto: CreateUserDto, User: IUser) {
    let hashedPassword = await hashPassword(createUserDto.password);
    // Check if the user already exists
    const existingUser = await this.UserModel.findOne({ mail: createUserDto.mail });
    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }
    let user = await this.UserModel.create({
      name: createUserDto.name,
      mail: createUserDto.mail,
      password: hashedPassword,
      age: createUserDto.age,
      gender: createUserDto.gender,
      role: createUserDto.role,
      createdBy: {
        _id: User._id,
        mail: User.mail
      }
    })
    return {
      id: user._id,
      name: user.name,
      createBy: user.createdBy,
    };
  }

  async register(registerUserDto: registerUserDto) {
    // Check if the user already exists
    const existingUser = await this.UserModel.findOne({ mail: registerUserDto.mail });
    if (existingUser) {
      throw new BadRequestException('User already exists with this email');
    }

    // Create a new user
    let hashedPassword = await hashPassword(registerUserDto.password);
    const newUser = await this.UserModel.create({
      name: registerUserDto.name,
      mail: registerUserDto.mail,
      password: hashedPassword,
      age: registerUserDto.age,
      gender: registerUserDto.gender,
      role: 'USER', // Default role if not provided
      createdAt: new Date(),
    })
    return newUser; // Return the newly created user
  }

  //C1.
  // async create(name: string, mail: string, password: string) {

  //   let hashedPassword = await this.hashPassword(password);
  //   let user = await this.UserModel.create({
  //     name, mail, password: hashedPassword,
  //   })
  //   return user;
  // }
  // return `This action adds a new user with name: ${name}, mail: ${mail}, password: ${password}`;

  async findAll(currentPage, limit, query) {
    const { filter, projection, population, sort } = aqp(query);
    delete filter.page;
    delete filter.limit;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;


    const totalItems = (await this.UserModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.UserModel.find(filter)
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
    if (!mongo.ObjectId.isValid(id)) {
      return `Invalid user`;
    }
    return this.UserModel.findOne({
      _id: id
    }).select('-password -__v').exec()
  }

  findOneByUserName(username: string) {
    return this.UserModel.findOne({
      mail: username
    });
  }

  update(updateUserDto: UpdateUserDto, user: IUser) {
    // console.log("check user: ==> ", user);
    return this.UserModel.updateOne(
      { _id: updateUserDto.id },
      {
        $set: {
          ...updateUserDto,
          updatedAt: new Date(),
          updatedBy: {
            _id: user._id,
            mail: user.mail
          }
        }
      })
  }

  remove(id: string, user: IUser) {
    // console.log(id);
    return this.UserModel.delete({ _id: id }, {
      deletedBy: {
        _id: user._id,
        mail: user.mail
      }
    }).then(result => {
      if (result.deletedCount === 0) {
        return `Không tìm thấy user có ID:  ${id}`;
      }
      return `Xóa User Thành công`;
    })
  }

  updaterefreshToken = async (_id: string, refreshToken: string) => {
    return await this.UserModel.updateOne(
      { _id },
      { refreshToken }
    )
  }
}
