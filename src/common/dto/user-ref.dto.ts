import { IsNotEmpty } from "class-validator";


export class UserRefDto {
    @IsNotEmpty()
    _id: string;

    @IsNotEmpty()
    name: string;
}