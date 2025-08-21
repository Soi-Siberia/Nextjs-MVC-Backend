import { IsNotEmpty } from "class-validator";

export class CreatePermissionDto {
    @IsNotEmpty({ message: 'Name Không được để trống' })
    name: string;
    @IsNotEmpty({ message: 'API Path Không được để trống' })
    apiPath: string;
    @IsNotEmpty({ message: 'Method Không được để trống' })
    method: string;
    @IsNotEmpty({ message: 'Module Không được để trống' })
    module: string; //thuộc modules nào ?
}
