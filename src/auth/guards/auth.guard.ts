import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

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

    // 토큰 검증
    await this.authService.tokenValidation({
      accessToken: token,
    });

    return true;
  }
}
