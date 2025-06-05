import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/infra/auth/decorator/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  @ApiCreatedResponse({ description: 'user successfully registered' })
  register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @Public()
  @Post('login')
  @ApiCreatedResponse({ description: 'successfully login' })
  login(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }

  @Get('me')
  @ApiCreatedResponse({ description: 'successfully login' })
  getProfile(@Req() req: any) {
    return req.user;
  }
}
