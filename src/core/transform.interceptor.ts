import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Res,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RESPONSE_MESSGAGE } from 'src/decorator/cusommize';
export interface Response<T> {
    statusCode: number;
    message?: string;
    data: any; // Adjust this type as needed, e.g., T or a specific interface
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {

    constructor(private reflector: Reflector) { }
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next
            .handle()
            .pipe(
                map((data) => ({
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    message:
                        this.reflector.get<string>(
                            RESPONSE_MESSGAGE,
                            context.getHandler(),
                        ) || '',
                    // data: {
                    //     result: data?.result || data, // Ensure data is always present
                    //     meta: {} // if this is supposed to be the actual return then replace {} with data.result
                    // }
                    data: data, // Ensure data is always present
                })),
            );
    }
}