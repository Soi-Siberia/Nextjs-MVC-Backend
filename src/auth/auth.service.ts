import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    // Validate user credentials
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUserName(username);
        if (user) {
            const isValid = await this.usersService.isvalidPassword(pass, user.password)
            if (isValid) {
                // const { password, ...result } = user.toObject();
                return user;
            }
        }
        return null;
    }

    // Generate JWT token for the user
    async login(user: any) {
        const payload = {
            username: user.mail,
            name: user.name,
            id: user._id
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
