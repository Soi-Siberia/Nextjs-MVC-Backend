import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password'] as const) {
    // OmitType(CreateUserDto, ['password'] as const) coppy lại dto CreateUserDto nhưng không có trường password
    // OmitType is used to create a new DTO that excludes the password field from CreateUserDto
    id: string; // Optional field for the user ID
}
