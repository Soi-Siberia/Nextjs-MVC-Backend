import { ArrayNotEmpty, IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class CreateRoleDto {
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    description: string
    @IsBoolean()
    @IsOptional()
    isActive: boolean = false

    @IsArray()
    @ArrayNotEmpty()
    @IsMongoId({ each: true })
    permissions: string[]

}
