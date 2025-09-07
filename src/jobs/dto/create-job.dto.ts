import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { UserRefDto } from "src/common/dto/user-ref.dto";

export class CreateJobDto {
    @IsNotEmpty({ message: 'Tên công việc không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Kỹ năng không được để trống' })
    skills: string[];

    @IsNotEmpty({ message: 'Mức lương không được để trống' })
    salary: number;

    @IsNotEmpty({ message: 'Số lượng tuyển không được để trống' })
    quantity: number; //số lượng tuyển

    @IsNotEmpty({ message: 'Cấp độ công việc không được để trống' })
    level: string;

    @IsNotEmpty({ message: 'Mô tả công việc không được để trống' })
    description: string;

    @IsNotEmpty({ message: 'Ngày bắt bắt đầu đăng tuyển không được để trống' })
    startDate: Date;

    @IsNotEmpty({ message: 'Ngày kết thúc đăng tuyển không được để trống' })
    endDate: Date;

    @ValidateNested()
    @Type(() => UserRefDto)
    company: UserRefDto;
}
