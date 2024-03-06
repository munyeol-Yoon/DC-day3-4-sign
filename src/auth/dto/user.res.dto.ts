import { PickType } from '@nestjs/mapped-types';
import { UserModel } from '../entities/user.entity';

export class UserResDto extends PickType(UserModel, [
  'name',
  'email',
  'createdAt',
  'updatedAt',
]) {}
