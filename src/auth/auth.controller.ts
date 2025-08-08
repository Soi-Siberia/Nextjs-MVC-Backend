import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from '../decorator/cusommize';
import { LocalAuthGuard } from './local-auth.guard';
import { registerUserDto } from '../users/dto/create-user.dto';
import { Response, Request } from 'express';
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
    async handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
        return await this.authService.login(req.user, response); // Return the user object after successful login
        // return this.authService.login(req.user); // Return the user object after successful login
    }


    @ResponseMessage("Get user profile")
    @Get('/account')
    handleAccount(@User() user: IUser) {
        return user; // Return the user object from the request
    }

    @Public()
    @ResponseMessage("Get user by refresh token")
    @Get('/refresh')
    handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies['refresh_token'];
        return this.authService.handleRefreshToken(refreshToken, response); // Handle refresh token logic
    }

    @Public()
    @ResponseMessage("Register a new user")
    @Post('/register')
    async register(@Body() registerUserDto: registerUserDto) {
        return this.authService.register(registerUserDto); // Handle user registration
    }


    // @UseGuards(JwtAuthGuard) // Use JWT authentication guard for this route
    @Get('profile')
    getProfile(@Res() req) {
        return req.user;
    }

    @ResponseMessage("Logout user")
    @Post('/logout')
    async handleLogout(
        @Res({ passthrough: true }) response: Response,
        @User() user: IUser) {
        return this.authService.logout(user, response); // Handle user logout
    }



}
