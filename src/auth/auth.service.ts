import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { UserReqDto } from './dto/user.req.dto';
import { UserModel } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async createUser(dto: UserReqDto): Promise<UserModel> {
    return await this.authRepository.createUser(dto);
  }
}
