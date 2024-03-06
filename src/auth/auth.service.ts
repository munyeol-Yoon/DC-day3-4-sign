import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { UserReqDto } from './dto/user.req.dto';
import { UserModel } from './entities/user.entity';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async createUser(dto: UserReqDto): Promise<UserModel> {
    const hashedPassword = await argon2.hash(dto.password);
    return await this.authRepository.createUser(dto, hashedPassword);
  }
}
