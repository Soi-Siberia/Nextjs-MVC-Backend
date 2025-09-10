
import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorator/cusommize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        console.log(">>> METHOD:", req.method);
        console.log(">>> PATH:", req.path);
        console.log(">>> BODY:", req.body);
        console.log(">>> QUERY:", req.query);
        console.log(">>> PARAMS:", req.params);
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException("Bạn chưa đăng nhập hoặc token đã hết hạn");
        }

        //check permission here
        const isExitst = user.permissions?.find(p => p.method === req.method && p.apiPath === req.path);
        if (!isExitst) {
            throw new ForbiddenException("Bạn không có quyền truy cập chức năng này");
        }
        return user;
    }
}
