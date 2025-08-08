import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { isvalidPassword } from '../common/utils/bcrypt.util'; // Import the isvalidPassword utility function
import { registerUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';


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
    async login(user: IUser, response: Response) {
        const { _id, name, mail, role } = user;
        const payload = {
            sub: "Token Login",
            iss: "from server",
            _id,
            name,
            mail,
            role
        };
        const refresh_token = this.createRefreshToken(payload)
        await this.usersService.updateUserToken(_id, refresh_token);

        // Set the refresh token in the response cookie
        response.clearCookie('refresh_token'); // Clear the old refresh token cookie
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 days
        });

        return {
            access_token: this.jwtService.sign(payload),
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
            expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION_TIME') // Use the configured expiration time

        })
        return refresh_token;
    }

    handleRefreshToken = async (refreshToken: string, response: Response) => {
        if (!refreshToken) {
            throw new BadRequestException('Vui Lòng đăng nhập lại'); // Please log in again
        }

        // Verify the refresh token
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('REFRESH_TOKEN_SECRET')
            });

            // Check if the user exists and has a matching refresh token
            const user = await this.usersService.findByRefreshToken(refreshToken)
            console.log('check user 1 ==> : ', user);
            console.log('----------------------------------');

            if (user) {
                const { _id, name, mail, role } = user;
                const payload = {
                    sub: "Token Refresh",
                    iss: "from server",
                    _id,
                    name,
                    mail,
                    role
                };
                const refresh_token = this.createRefreshToken(payload)
                await this.usersService.updateUserToken(_id, refresh_token);

                response.clearCookie('refresh_token'); // Clear the old refresh token cookie
                // Set the new refresh token in the response cookie
                response.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000, // 1 days
                });
                console.log('check user 2 ==> : ', user);
                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        mail,
                        role
                    }
                };

            } else {
                throw new BadRequestException('Vui Lòng đăng nhập lại'); // Please log in again

            }

        } catch (e) {
            throw new BadRequestException('Vui Lòng đăng nhập lại'); // Please log in again
        }

    }


    logout = async (user: IUser, response: Response) => {
        await this.usersService.updateUserToken(user._id, "")
        response.clearCookie('refresh_token'); // Clear the refresh token cookie
        return {
            message: "Logout Thành Công" // Logout successful,
        };
    }
}
