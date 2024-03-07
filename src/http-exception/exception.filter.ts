import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomException } from './custom-exception';
import { Domain } from './custom-exception';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

export type ApiError = {
  id: string;
  domain: Domain;
  message: string;
  apiMessage: string;
  statusCode: HttpStatus;
  timestamp: Date;
};

@Catch(Error, CustomException, HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  catch(
    exception: Error | CustomException | HttpException,
    host: ArgumentsHost,
  ) {
    let status: HttpStatus;
    let body: ApiError;

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (exception instanceof CustomException) {
      status = exception.statusCode;
      body = {
        id: exception.id,
        domain: exception.domain,
        message: exception.message,
        apiMessage: exception.apiMessage,
        statusCode: exception.statusCode,
        timestamp: exception.timestamp,
      };
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      body = new CustomException(
        'generic',
        exception.message,
        exception.message,
        exception.getStatus(),
      );
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      body = new CustomException(
        'generic',
        `Internal server error ${exception.message}`,
        `Internal server error`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const log = `
      >> path: ${req.url}
      >> HttpStatus: ${status},
      >> ErrorMessage: ${exception}`;

    this.logger.error(log);

    res.status(status).json(body);
  }
}

/*
어떻게 에러를 주고 싶은가?
{
    "id" : "고유ID"
    "domain" : "어떤유형의 에러인지",
    "message": "이메일 중복",
    "apiMessage" : "이미 가입된 이메일입니다."
    "statusCode": 409,
    "timestamp" : "예외 발생 시간"
}

에러 발생 코드를 어떻게 적을까?

throw new HttpException(
  '도메인',
  '메시지',
  'api메시지',
  '상태코드'
)


상속받아서 사용했을때 exception 값 ========================

HttpException [Error]: 에러메시지
    at AuthService.createUser (/Users/yunmun-yeol/Documents/nestjs/devcamp/sign/src/auth/auth.service.ts:16:13)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at AuthController.signUp (/Users/yunmun-yeol/Documents/nestjs/devcamp/sign/src/auth/auth.controller.ts:12:18)
    at /Users/yunmun-yeol/Documents/nestjs/devcamp/sign/.yarn/unplugged/@nestjs-core-virtual-c69f7f2f5a/node_modules/@nestjs/core/router/router-execution-context.js:46:28
    at /Users/yunmun-yeol/Documents/nestjs/devcamp/sign/.yarn/unplugged/@nestjs-core-virtual-c69f7f2f5a/node_modules/@nestjs/core/router/router-proxy.js:9:17 {
  domain: 'user',
  apiMessage: 'api에러',
  status: 400,
  id: 'asd',
  timestamp: 2024-03-06T09:22:18.149Z
}

HttpException 값 ===================================

HttpException: user
    at AuthService.createUser (/Users/yunmun-yeol/Documents/nestjs/devcamp/sign/src/auth/auth.service.ts:15:13)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at AuthController.signUp (/Users/yunmun-yeol/Documents/nestjs/devcamp/sign/src/auth/auth.controller.ts:12:18)
    at /Users/yunmun-yeol/Documents/nestjs/devcamp/sign/.yarn/unplugged/@nestjs-core-virtual-c69f7f2f5a/node_modules/@nestjs/core/router/router-execution-context.js:46:28
    at /Users/yunmun-yeol/Documents/nestjs/devcamp/sign/.yarn/unplugged/@nestjs-core-virtual-c69f7f2f5a/node_modules/@nestjs/core/router/router-proxy.js:9:17 {
  response: 'user',
  status: '에러메시지',
  options: 'api에러'
}


*/
