import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateResumeDto {
    @IsNotEmpty({ message: "url không được để trống" })
    url: string;

    @IsNotEmpty({ message: "CompanyID không được để trống" })
    @IsMongoId({ message: "CompanyID không hợp lệ" })
    companyId: string;

    @IsNotEmpty({ message: "JobID không được để trống" })
    @IsMongoId({ message: "JobID không hợp lệ" })
    jobId: string;
}
