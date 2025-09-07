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
import { USER_ROLE } from 'src/databases/sample';
import { Role, RoleSchema } from 'src/roles/schemas/role.schema';


@Injectable()
export class UsersService {


  constructor(
    @InjectModel(User.name) private UserModel: SoftDeleteModel<User>,

    @InjectModel(Role.name) private RoleModel: SoftDeleteModel<Role>,

  ) { }

  // isvalidPassword = async (password: string, hashedPassword: string) => {
  //   return await bcrypt.compare(password, hashedPassword);
  // }

  async create(createUserDto: CreateUserDto, User: IUser) {

    const userRole = await this.RoleModel.findOne({ name: USER_ROLE });

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
      role: userRole?._id, // Default role if not provided
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

    const userRole = await this.RoleModel.findOne({ name: USER_ROLE });
    if (!userRole) {
      throw new BadRequestException('Đã phát sinh lỗi: Lỗi không tìm thấy role USER_ROLE');
    }

    // Create a new user
    let hashedPassword = await hashPassword(registerUserDto.password);
    const newUser = await this.UserModel.create({
      name: registerUserDto.name,
      mail: registerUserDto.mail,
      password: hashedPassword,
      age: registerUserDto.age,
      gender: registerUserDto.gender,
      role: userRole?._id, // Default role if not provided
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
    delete filter.current;
    delete filter.pageSize;

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
    })
      .select('-password -__v')
      .populate({
        path: "role",
        select: { name: 1, _id: 1 }
      })
      .exec()
  }

  findOneByUserName(username: string) {
    return this.UserModel.findOne({
      mail: username
    })
      .populate({
        path: "role",
        select: { name: 1 }
      })
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

  async remove(id: string, user: IUser) {
    console.log(id);
    const checkuser = await this.UserModel.findById(id)
    if (checkuser.mail === "admin@gmail.com") {
      throw new BadRequestException("Bạn ko có quyển delete user này! Vui lòng kiểm tra lại")
    }
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

  updateUserToken = async (_id: string, refreshToken: string) => {
    return await this.UserModel.updateOne(
      { _id },
      { refreshToken }
    )
  }

  findByRefreshToken = async (refreshToken: string) => {
    return await this.UserModel.findOne({ refreshToken })
      .populate({
        path: "role",
        select: { name: 1 }
      })
  }
}
