import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { isvalidPassword } from '../common/utils/bcrypt.util'; // Import the isvalidPassword utility function
import { registerUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }


    async register(user: registerUserDto) {
        // Check if the user already exists
        const createdUser = await this.usersService.register(user);
        return {
            _id: createdUser?._id,
            createdAt: createdUser?.createdAt,
        };
    }

    // Validate user credentials
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUserName(username);
        if (user) {
            const isValid = await isvalidPassword(pass, user.password)
            if (isValid) {
                // const { password, ...result } = user.toObject();
                return user;
            }
        }
        return null;
    }

    // Generate JWT token for the user
    async login(user: IUser) {
        const { _id, name, mail, role } = user;
        const payload = {
            sub: "Token Login",
            iss: "from server",
            _id,
            name,
            mail,
            role
        };

        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.createRefreshToken(payload),
            user: {
                _id,
                name,
                mail,
                role
            }
        };
    }


    createRefreshToken = (payload) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION_TIME')
        })

        return refresh_token;
    }
}
