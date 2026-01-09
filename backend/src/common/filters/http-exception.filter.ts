import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/ApiResponse';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    
    let message = 'Error interno del servidor';
    let errors: any = undefined;
    
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object' && response !== null) {
        const responseObj = response as any;
        message = responseObj.message || responseObj.error || 'Error en la petición';
        errors = responseObj;
      }
    }
    
    const errorResponse: ApiResponse<null> = {
      success: false,
      statusCode: status,
      message,
      errors,
    };
    
    response.status(status).json(errorResponse);
  }
}

