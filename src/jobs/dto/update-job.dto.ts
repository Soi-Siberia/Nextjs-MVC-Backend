import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRefDto } from 'src/common/dto/user-ref.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) {

    @IsNotEmpty({ message: 'Tên công việc không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Kỹ năng không được để trống' })
    skill: string[];

    @IsNotEmpty({ message: 'Mức lương không được để trống' })
    salary: number;

    @IsNotEmpty({ message: 'Số lượng tuyển không được để trống' })
    quantity: number; //số lượng tuyển

    @IsNotEmpty({ message: 'Cấp độ công việc không được để trống' })
    level: string;

    @IsNotEmpty({ message: 'Mô tả công việc không được để trống' })
    description: string;

    @IsNotEmpty({ message: 'Ngày bắt bắt đầu đăng tuyển không được để trống' })
    stratDate: Date;

    @IsNotEmpty({ message: 'Ngày kết thúc đăng tuyển không được để trống' })
    eddDate: Date;

    @ValidateNested()
    @Type(() => UserRefDto)
    company: UserRefDto;
}
