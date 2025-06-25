import { Controller, Get, Post, Render, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config'; // Import ConfigService to access environment variables
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService, // Import ConfigService to access environment variables
  ) { }

  // @UseGuards(AuthGuard('local')) //hasd code to be used with the local strategy
  // @Post('/login')
  // handleLogin(@Request() req): string {
  //   return req.user; // Return the user object after successful login
  // }

  @UseGuards(LocalAuthGuard) //hasd code to be used with the local strategy
  @Post('/login')
  handleLogin(@Request() req): string {
    return req.user; // Return the user object after successful login
  }
}
