
import { IsNotEmpty, IsNumberString } from 'class-validator';


export class CreateCompanyDto {
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Phone không được để trống' })
    @IsNumberString({}, { message: 'Phone phải là một chuỗi số' })
    phone: string;

    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @IsNotEmpty({ message: 'Address không được để trống' })
    address: string;

    @IsNotEmpty({ message: 'Description không được để trống' })
    description: string;
}

