import { IsEmail, IsNotEmpty } from 'class-validator';


export class CreateUserDto {
    @IsNotEmpty()
    name: string;

    @IsEmail()
    mail: string;

    @IsNotEmpty()
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}
