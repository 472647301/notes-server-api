import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const exc = exception || {};
    const _status = exc.getStatus ? exception.getStatus() : 500;
    const status = response.statusCode || _status;
    response.status(status).json({
      code: status,
      success: false,
      timestamp: new Date().toLocaleString(),
      // path: request.url,
      error: exc.message,
    });
  }
}
