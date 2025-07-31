import { IsEmail, isNotEmpty, IsNotEmpty, ValidateNested } from 'class-validator';
import { CompanyUserDto } from './company-user.dto';
import { Type } from 'class-transformer';
import { UserRefDto } from 'src/common/dto/user-ref.dto';


export class CreateUserDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @IsEmail()
    mail: string;

    @IsNotEmpty({ message: 'Tuổi không được để trống' })
    age: string;

    @IsNotEmpty({ message: 'Giới tính không được để trống' })
    gender: string;

    @IsNotEmpty({ message: 'Vai trò không được để trống' })
    role: string;

    @IsNotEmpty()
    password: string;
    createdAt?: Date;
    updatedAt?: Date;

    @ValidateNested()
    @Type(() => CompanyUserDto)
    company: CompanyUserDto;


    @ValidateNested()
    @Type(() => UserRefDto)
    createdBy: UserRefDto;

    @ValidateNested()
    @Type(() => UserRefDto)
    updatedBy: UserRefDto;
}

export class registerUserDto {
    @IsNotEmpty({ message: 'Tên không được để trống' })
    name: string;

    @IsEmail()
    mail: string;

    @IsNotEmpty({ message: 'Tuổi không được để trống' })
    age: string;

    @IsNotEmpty({ message: 'Giới tính không được để trống' })
    gender: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    password: string;

}
