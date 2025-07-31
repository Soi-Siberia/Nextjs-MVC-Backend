import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, registerUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { mongo } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete'; // Import SoftDeleteModel if you are using soft delete
import { IUser } from './users.interface';
import { hashPassword } from '../common/utils/bcrypt.util'; // Import the hashPassword utility function

@Injectable()
export class UsersService {


  constructor(@InjectModel(User.name) private UserModel: SoftDeleteModel<User>) { }

  // isvalidPassword = async (password: string, hashedPassword: string) => {
  //   return await bcrypt.compare(password, hashedPassword);
  // }

  async create(createUserDto: CreateUserDto) {
    let hashedPassword = await hashPassword(createUserDto.password);
    let user = await this.UserModel.create({
      name: createUserDto.name,
      mail: createUserDto.mail,
      password: hashedPassword,
      age: createUserDto.age,
      gender: createUserDto.gender,
      role: createUserDto.role,
    })
    return user;
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

  findAll() {
    return this.UserModel.find().select('-password -__v').exec();
  }

  findOne(id: string) {
    if (!mongo.ObjectId.isValid(id)) {
      return `Invalid user ID: ${id}`;
    }
    return this.UserModel.findOne({
      _id: id
    });
  }

  findOneByUserName(username: string) {
    return this.UserModel.findOne({
      mail: username
    });
  }

  update(updateUserDto: UpdateUserDto, user: IUser) {
    // console.log("check user: ==> ", user);
    return this.UserModel.updateOne({ _id: updateUserDto.id }, { ...updateUserDto, updatedAt: new Date() })
  }

  remove(id: string) {
    // console.log(id);
    return this.UserModel.delete({ _id: id }).then(result => {
      if (result.deletedCount === 0) {
        return `Không tìm thấy user có ID:  ${id}`;
      }
      return `Xóa User Thành công`;
    })
  }
}
