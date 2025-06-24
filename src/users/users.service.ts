import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, mongo } from 'mongoose';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {


  constructor(@InjectModel(User.name) private UserModel: Model<User>) { }

  hashPassword = async (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(password, salt);
    return hash;
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
    return `This action returns all users`;
  }

  findOne(id: string) {
    if (!mongo.ObjectId.isValid(id)) {
      return `Invalid user ID: ${id}`;
    }
    return this.UserModel.findOne({
      _id: id
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
