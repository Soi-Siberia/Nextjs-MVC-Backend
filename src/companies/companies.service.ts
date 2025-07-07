import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from './schemas/company.shema';

@Injectable()
export class CompaniesService {

  constructor(
    @InjectModel(Company.name) private CompanyModel: Model<Company>
  ) { }

  async create(createCompanyDto: CreateCompanyDto) {
    const resultCreate = await this.CompanyModel.create(createCompanyDto);
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
