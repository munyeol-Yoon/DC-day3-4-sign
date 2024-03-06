import { HttpStatus } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserReqDto } from './dto/user.req.dto';
import * as argon2 from 'argon2';
import { CustomException } from 'src/http-exception/custom-exception';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(dto: UserReqDto): Promise<UserReqDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (user) {
      throw new CustomException(
        'user',
        '에러메시지',
        'api에러',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await argon2.hash(dto.password);
    const resUser = await this.userRepository.createUser(dto, hashedPassword);

    const payload = this.authService.createTokenPayload(resUser.id);

    const [accessToken, refreshToken] = await Promise.all([
      this.authService.createAccessToken(payload),
      this.authService.createRefreshToken(payload),
    ]);

    const result = {
      accessToken,
      refreshToken,
      ...resUser,
    };

    return result;
  }
}
