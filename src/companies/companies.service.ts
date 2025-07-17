import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'mongoose-delete'; // Import SoftDeleteModel if you are using soft delete
import { Company } from './schemas/company.shema';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';

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

  async findAll(currentPage, limit, query) {
    const { filter, projection, population, sort } = aqp(query);
    delete filter.page;
    delete filter.limit;

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;


    const totalItems = (await this.CompanyModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.CompanyModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

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

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {

    // console.log("===> check updateCompanyDto: ", updateCompanyDto);
    const updateCompany = await this.CompanyModel.findOneAndUpdate(
      {
        _id: id,
        deleted: false
      },
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id, // Assuming updatedBy is passed in the DTO
          name: user.name, // Assuming updatedBy has a name field
        },
      },
      {
        new: true, // Return the updated document
      }
    )
    if (!updateCompany) {
      throw new NotFoundException('Công ty không tồn tại hoặc đã bị xóa');
    }

    return updateCompany;
  }

  async remove(id: string, user: IUser) {

    // Bước 1: Cập nhật deletedBy
    await this.CompanyModel.updateOne(
      { _id: id, deleted: false },
      {
        deletedBy: {
          _id: user._id,
          name: user.name,
        },
      }
    );

    // Bước 2: Gọi xoá mềm từ plugin mongoose-delete

    const deleted = await this.CompanyModel.delete(
      { _id: id },
    );

    if (deleted.deletedCount === 0) {
      throw new NotFoundException(`Công ty với ID ${id} không tồn tại hoặc đã bị xoá`);
    }

    return { message: `Công ty với ID ${id} đã xoá thành công` };
  }
}
