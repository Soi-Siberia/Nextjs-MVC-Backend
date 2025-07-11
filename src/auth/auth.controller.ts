import { Controller, Get, Post, Render, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../decorator/cusommize';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService // Import AuthService to use its methods
    ) { }

    @Public()
    @UseGuards(LocalAuthGuard) //hasd code to be used with the local strategy
    @Post('/login')
    handleLogin(@Request() req) {
        return this.authService.login(req.user); // Return the user object after successful login
    }

    // @UseGuards(JwtAuthGuard) // Use JWT authentication guard for this route
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
