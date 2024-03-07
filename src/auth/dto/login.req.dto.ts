import { PickType } from '@nestjs/mapped-types';
import { UserModel } from '../entities/user.entity';

export class LoginReqDto extends PickType(UserModel, ['email', 'password']) {}
