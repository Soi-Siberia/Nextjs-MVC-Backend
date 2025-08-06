import { Body, Controller, Get, Post, Render, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from '../decorator/cusommize';
import { LocalAuthGuard } from './local-auth.guard';
import { registerUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService // Import AuthService to use its methods
    ) { }

    @Public()
    @ResponseMessage("Login user")
    @UseGuards(LocalAuthGuard) //hasd code to be used with the local strategy
    @Post('/login')
    handleLogin(@Request() req) {
        return this.authService.login(req.user); // Return the user object after successful login
    }

    @Public()
    @ResponseMessage("Register a new user")
    @Post('/register')
    async register(@Body() registerUserDto: registerUserDto) {
        return this.authService.register(registerUserDto); // Handle user registration
    }


    // @UseGuards(JwtAuthGuard) // Use JWT authentication guard for this route
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }



}
