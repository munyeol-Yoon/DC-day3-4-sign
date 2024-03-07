import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserReqDto } from './dto/user.req.dto';
import { UserResDto } from './dto/user.res.dto';
import { LoginReqDto } from './dto/login.req.dto';
import { AuthService } from './auth.service';
import { Tokens } from './types/types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signUp(@Body() body: UserReqDto): Promise<UserResDto> {
    const user = await this.userService.createUser(body);

    return {
      accessToken: user['accessToken'],
      refreshToken: user['refreshToken'],
      id: user['id'],
      name: user['name'],
      email: user['email'],
      createdAt: user['createdAt'],
      updatedAt: user['updatedAt'],
    };
  }

  @Post('login')
  async login(@Body() body: LoginReqDto): Promise<Tokens> {
    return await this.authService.login(body);
  }
}
