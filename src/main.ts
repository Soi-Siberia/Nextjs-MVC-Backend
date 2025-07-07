import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.useStaticAssets(join(__dirname, '..', 'public')); //js, css, images, etc.
  app.setBaseViewsDir(join(__dirname, '..', 'views')); //views
  app.setViewEngine('ejs');

  //cấu hình CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'https://yourdomain.xyz'], // Replace with your frontend URL
    credentials: true,
  });

  // Set global prefix for API routes thay vì set ở AppModule
  const reflector = app.get(Reflector); // ✅ lấy Reflector từ DI container
  // app.useGlobalGuards(new JwtAuthGuard(reflector)); // ✅ truyền đúng cách

  // validation class pipes
  // https://docs.nestjs.com/techniques/validation#class-validator
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get('PORT') || 6969); // Use PORT from environment variables or default to 3000
}
bootstrap();
