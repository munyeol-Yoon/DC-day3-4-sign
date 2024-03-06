import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserReqDto } from './dto/user.req.dto';
import { UserResDto } from './dto/user.res.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() body: UserReqDto): Promise<UserResDto> {
    const user = await this.userService.createUser(body);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
