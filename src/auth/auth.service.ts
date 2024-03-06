import { HttpStatus } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { UserReqDto } from './dto/user.req.dto';
import { UserModel } from './entities/user.entity';
import * as argon2 from 'argon2';
import { CustomException } from 'src/http-exception/custom-exception';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async createUser(dto: UserReqDto): Promise<UserModel> {
    const user = await this.authRepository.findByEmail(dto.email);
    if (user) {
      throw new CustomException(
        'user',
        '에러메시지',
        'api에러',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await argon2.hash(dto.password);
    return await this.authRepository.createUser(dto, hashedPassword);
  }
}
