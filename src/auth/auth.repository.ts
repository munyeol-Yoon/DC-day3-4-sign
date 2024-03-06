import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserModel } from './entities/user.entity';
import { UserReqDto } from './dto/user.req.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly repository: Repository<UserModel>,
  ) {}

  async createUser(dto: UserReqDto): Promise<UserModel> {
    const user = this.repository.create(dto);
    return await this.repository.save(user);
  }
}
