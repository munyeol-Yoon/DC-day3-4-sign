import { ConflictException, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { UserReqDto } from './dto/user.req.dto';
import { UserModel } from './entities/user.entity';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async createUser(dto: UserReqDto): Promise<UserModel> {
    const user = await this.authRepository.findByEmail(dto.email);
    if (user) {
      throw new ConflictException('이미 가입된 이메일');
    }

    const hashedPassword = await argon2.hash(dto.password);
    return await this.authRepository.createUser(dto, hashedPassword);
  }
}
