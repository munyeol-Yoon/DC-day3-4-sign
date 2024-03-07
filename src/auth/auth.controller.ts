import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserReqDto } from './dto/user.req.dto';
import { UserResDto } from './dto/user.res.dto';
import { LoginReqDto } from './dto/login.req.dto';
import { AuthService } from './auth.service';
import { AccessToken, RefreshToken, Tokens } from './types/types';
import { AuthGuard } from './guards/auth.guard';

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

  @Post('refresh')
  async refresh(@Body() body: RefreshToken): Promise<AccessToken> {
    return await this.authService.accessTokenRefresh(body);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile() {
    return '개인정보 받아랏';
  }
}
