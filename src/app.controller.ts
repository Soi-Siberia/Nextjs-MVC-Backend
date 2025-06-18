import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config'; // Import ConfigService to access environment variables

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService, // Import ConfigService to access environment variables
  ) { }

  @Get()
  @Render("home")
  handleHompage() {
    const message = this.appService.getHello();
    return {
      message: message
    };
  }
}
