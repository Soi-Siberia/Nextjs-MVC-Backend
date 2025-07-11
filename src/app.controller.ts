import { Controller, Get, Post, Render, Request, UseGuards } from '@nestjs/common';
// import { AppService } from './app.service';
// import { ConfigService } from '@nestjs/config'; // Import ConfigService to access environment variables
// import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Public } from './decorator/cusommize';

@Controller()
export class AppController {
  constructor(
    // private readonly appService: AppService,
    // private configService: ConfigService, // Import ConfigService to access environment variables
    private authService: AuthService // Import AuthService to use its methods
  ) { }

  // @UseGuards(AuthGuard('local')) //hasd code to be used with the local strategy
  // @Post('/login')
  // handleLogin(@Request() req) {
  //   console.log("===> check req: ", req.user); // Log the user object from
  //   return this.authService.login(req.user); // Return the user object after successful login
  // }


  // @Public()
  // @UseGuards(LocalAuthGuard) //hasd code to be used with the local strategy
  // @Post('/login')
  // handleLogin(@Request() req) {
  //   return this.authService.login(req.user); // Return the user object after successful login
  // }

  // // @UseGuards(JwtAuthGuard) // Use JWT authentication guard for this route
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}
