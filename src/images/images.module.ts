import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService, // Use the MulterConfigService to configure multer
    })
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule { }
