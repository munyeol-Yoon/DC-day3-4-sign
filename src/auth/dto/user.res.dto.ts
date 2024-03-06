import { PickType } from '@nestjs/mapped-types';
import { UserModel } from '../entities/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserResDto extends PickType(UserModel, [
  'id',
  'name',
  'email',
  'createdAt',
  'updatedAt',
]) {
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
