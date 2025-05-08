import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let code = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = '服务器内部错误';

        if (exception instanceof HttpException) {
            const res: any = exception.getResponse();
            code = exception.getStatus();

            if (res.message) {
                // 返回所有错误信息数组
                message = Array.isArray(res.message) ? res.message : [res.message];
            }
        }

        response.status(code).json({
            code,
            message,
            data: null,
        });
    }
}
