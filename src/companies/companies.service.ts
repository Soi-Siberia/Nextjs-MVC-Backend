import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete'; // Import SoftDeleteModel if you are using soft delete
import { Company } from './schemas/company.shema';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class CompaniesService {

  constructor(
    @InjectModel(Company.name) private CompanyModel: SoftDeleteModel<Company>
  ) { }

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {

    const companyExists = await this.CompanyModel.findOne({
      name: createCompanyDto.name,
      deleted: false
    });
    if (companyExists) {
      throw new ConflictException('Tên công ty đã tồn tại, Vui lòng kiểm tra lại')
    }
    const resultCreate = await this.CompanyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id, // Assuming createdBy is passed in the DTO
        name: user.name, // Assuming createdBy has a name field
      },
      // If you want to add more fields, you can do it her
    });
    return resultCreate;
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
