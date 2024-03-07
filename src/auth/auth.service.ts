import { UserRepository } from './user.repository';
import { ConfigService } from '@nestjs/config';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { AccessToken, Payload, RefreshToken, Tokens } from './types/types';
import { CustomException } from 'src/http-exception/custom-exception';
import { LoginReqDto } from './dto/login.req.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async login(dto: LoginReqDto): Promise<Tokens> {
    // 유저 존재 확인
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new CustomException(
        'user',
        '가입되지 않은 이메일 입니다.',
        '가입되지 않은 이메일 입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 비밀번호 일치여부 확인
    // await this.checkPassword(user.password, dto.password);

    // 토큰 발급
    const payload = this.createTokenPayload(user.id);

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(payload),
      this.createRefreshToken(payload),
    ]);

    // 토큰 보내주기
    return { accessToken, refreshToken };
  }

  async checkPassword(
    password: string,
    savedPassword: string,
  ): Promise<boolean> {
    const verifyUser = await argon2.verify(password, savedPassword);
    if (!verifyUser) {
      throw new CustomException(
        'user',
        '이메일 또는 비밀번호가 일치하지 않습니다.',
        '이메일 또는 비밀번호가 일치하지 않습니다.',
        HttpStatus.CONFLICT,
      );
    }

    return verifyUser;
  }

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

  async accessTokenRefresh(token: RefreshToken): Promise<AccessToken> {
    // 리프레쉬토큰 검증
    const refreshToken = token.refreshToken;
    const { exp, ...payload } = await this.jwtService.verifyAsync(
      refreshToken,
      {
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );

    // 토큰 일치여부 확인
    const user = await this.userRepository.findOne(payload.sub);
    if (!user) {
      throw new CustomException(
        'auth',
        '유저 존재하지 않음',
        '유저 존재하지 않음',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // 액세스 토큰 생성
    const accessToken = await this.createAccessToken(payload);
    // 액세스 토큰 반환

    return { accessToken };
  }
}
