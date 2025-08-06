import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from '../decorator/cusommize';
import { LocalAuthGuard } from './local-auth.guard';
import { registerUserDto } from '../users/dto/create-user.dto';
import { Response } from 'express';
import { IUser } from 'src/users/users.interface';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService // Import AuthService to use its methods
    ) { }

    @Public()
    @ResponseMessage("Login user")
    @UseGuards(LocalAuthGuard) //hasd code to be used with the local strategy
    @Post('/login')
    async handleLogin(@Request() req, @Res({ passthrough: true }) response: Response) {
        const { user, access_token, refresh_token } = await this.authService.login(req.user); // Return the user object after successful login
        // return this.authService.login(req.user); // Return the user object after successful login

        // set cookie with the refresh token
        // response.cookie('refresh_token', refresh_token, {
        //     httpOnly: true,
        //     maxAge: 24 * 60 * 60 * 1000, // 1 days
        // });
        return {
            user,
            access_token,
            refresh_token
        };
    }


    @ResponseMessage("Get user profile")
    @Get('/account')
    handleAccount(@User() user: IUser) {
        return user; // Return the user object from the request
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
