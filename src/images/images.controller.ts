import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/decorator/cusommize';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) { }

  @Post('upload')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: /(jpg|jpeg|png)$/,
      })
      .addMaxSizeValidator({
        maxSize: 1204 * 1204, // = 1MB
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        exceptionFactory: (errors) => {
          const errorList = Array.isArray(errors) ? errors : [errors];

          if (errorList.some(e => e.includes('expected size is less'))) {
            return {
              statusCode: 422,
              error: 'Unprocessable Entity',
              message: 'Dung lượng file vượt quá giới hạn cho phép',
            };
          }

          if (errorList.some(e => e.includes('expected type is'))) {
            return {
              statusCode: 422,
              error: 'Unprocessable Entity',
              message: 'Định dạng file không hợp lệ, chỉ chấp nhận JPG/PNG',
            };
          }

          return {
            statusCode: 422,
            error: 'Unprocessable Entity',
            message: 'File upload không hợp lệ',
          };
        }
      }),
  ) file: Express.Multer.File) {
    console.log(file);
  }

  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(+id, updateImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagesService.remove(+id);
  }
}
