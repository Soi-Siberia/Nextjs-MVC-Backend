import { IsEmail, isNotEmpty, IsNotEmpty, ValidateNested } from 'class-validator';
import { CompanyUserDto } from './company-user.dto';
import { Type } from 'class-transformer';
import { UserRefDto } from 'src/common/dto/user-ref.dto';


export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    mail: string;

    @IsNotEmpty()
    age: string;

    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
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
    @IsNotEmpty()
    name: string;

    @IsEmail()
    mail: string;

    @IsNotEmpty()
    age: string;

    @IsNotEmpty()
    gender: string;

    @IsNotEmpty()
    password: string;

}
