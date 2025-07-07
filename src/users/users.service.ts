import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, mongo } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { SoftDeleteModel } from 'mongoose-delete'; // Import SoftDeleteModel if you are using soft delete

@Injectable()
export class UsersService {


  constructor(@InjectModel(User.name) private UserModel: SoftDeleteModel<User>) { }

  hashPassword = async (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);
    return hash;
  }

  isvalidPassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
  }

  async create(createUserDto: CreateUserDto) {
    let hashedPassword = await this.hashPassword(createUserDto.password);
    let user = await this.UserModel.create({
      name: createUserDto.name,
      mail: createUserDto.mail,
      password: hashedPassword,
    })
    return user;
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

  update(updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return this.UserModel.updateOne({ _id: updateUserDto.id }, { ...updateUserDto, updatedAt: new Date() })
  }

  remove(id: string) {
    console.log(id);
    return this.UserModel.delete({ _id: id }).then(result => {
      if (result.deletedCount === 0) {
        return `User with ID ${id} not found`;
      }
      return `User with ID ${id} deleted successfully`;
    })
  }
}
