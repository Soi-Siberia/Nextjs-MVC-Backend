import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CompanyUserDto } from './company-user.dto';
import { UserRefDto } from 'src/common/dto/user-ref.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {

    @IsNotEmpty()
    id: string;

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

    @IsOptional()
    updatedAt?: Date;

    @ValidateNested()
    @Type(() => UserRefDto)
    updatedBy: UserRefDto;
}
