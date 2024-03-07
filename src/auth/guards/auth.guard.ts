import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UserRepository } from '../user.repository';
import { CustomException } from 'src/http-exception/custom-exception';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
    private configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 콘텍스트에서 요청 가져오기
    const req = context.switchToHttp().getRequest();

    return this.validationRequest(req);
  }

  private async validationRequest(req: any): Promise<boolean> {
    // 헤더에 토큰 확인
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('헤더에 토큰이 없습니다.');
    }

    // 토큰 분리
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token.');
    }

    try {
      // 페이로드 확인
      const { exp, ...payload } = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
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

      return true;
    } catch (error) {
      throw new UnauthorizedException('토큰 검증 실해');
    }
  }
}
