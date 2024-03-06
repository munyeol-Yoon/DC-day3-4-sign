import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { Payload } from './types/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  createTokenPayload(userId: string): Payload {
    return {
      sub: userId,
      iat: Math.floor(Date.now() / 1000), // JWT 표준에 부합하기에..
      jti: uuid(),
    };
  }

  async createAccessToken(payload: Payload): Promise<string> {
    const expiresIn = this.configService.get<string>('ACCESS_EXPIRES');

    const key = this.configService.get<string>('JWT_SECRET');

    const token = this.jwtService.sign(payload, {
      expiresIn,
      secret: key,
    });

    return token;
  }

  async createRefreshToken(payload: Payload): Promise<string> {
    const expiresIn = this.configService.get<string>('REFRESH_EXPIRES');

    const key = this.configService.get<string>('JWT_SECRET');

    const token = this.jwtService.sign(payload, {
      expiresIn,
      secret: key,
    });

    return token;
  }
}
