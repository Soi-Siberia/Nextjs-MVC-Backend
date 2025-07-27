import { IsNotEmpty } from "class-validator";

export class CompanyUserDto {
    @IsNotEmpty()
    _id: string;

    @IsNotEmpty()
    name: string;
}