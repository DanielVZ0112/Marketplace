import { ApiResponse } from '../interfaces/ApiResponse';

export class HttpResponse {
  static ok<T>(data: T, message = 'OK'): ApiResponse<T> {
    return {
      success: true,
      statusCode: 200,
      message,
      data,
    };
  }

  static created<T>(data: T, message = 'Created'): ApiResponse<T> {
    return {
      success: true,
      statusCode: 201,
      message,
      data,
    };
  }

  static badRequest(message: string, errors?: any): ApiResponse<null> {
    return {
      success: false,
      statusCode: 400,
      message,
      errors,
    };
  }

  static errorServer(message: string, errors?: any): ApiResponse<null> {
    return {
      success: false,
      statusCode: 500,
      message,
      errors,
    };
  }
}
