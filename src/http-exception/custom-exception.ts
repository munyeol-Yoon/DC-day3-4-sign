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
*/

import { HttpStatus } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

export type Domain = 'user' | 'generic' | 'pipe';

export class CustomException extends Error {
  public readonly id: string;
  public readonly timestamp: Date;

  constructor(
    public readonly domain: Domain,
    public readonly message: string,
    public readonly apiMessage: string,
    public readonly statusCode: HttpStatus,
  ) {
    super(message);
    this.id = uuid();
    this.timestamp = new Date();
  }
}
