import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const exc = exception || {};
    const status = exc.getStatus ? exception.getStatus() : 500;
    response.status(status).json({
      code: status,
      success: false,
      timestamp: new Date().toLocaleString(),
      // path: request.url,
      error: exc.message || 'Forbidden resource',
    });
  }
}
