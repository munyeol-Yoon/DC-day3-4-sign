import { PickType } from '@nestjs/mapped-types';
import { UserModel } from '../entities/user.entity';

export class UserReqDto extends PickType(UserModel, [
  'name',
  'email',
  'phone',
  'password',
]) {}
