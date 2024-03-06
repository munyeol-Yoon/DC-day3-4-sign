import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserModel } from './entities/user.entity';
import { UserReqDto } from './dto/user.req.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly repository: Repository<UserModel>,
  ) {}

  async createUser(
    dto: UserReqDto,
    hashedPassword: string,
  ): Promise<UserModel> {
    const user = this.repository.create(dto);
    user.password = hashedPassword;
    return await this.repository.save(user);
  }

  async findByEmail(email: string): Promise<UserModel> {
    return await this.repository.findOneBy({ email });
  }
}
