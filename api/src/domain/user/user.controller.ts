import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Public } from 'src/infra/auth/decorator/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';

@ApiTags('Auth')
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  @ApiCreatedResponse({
    description: 'User successfully registered',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiConflictResponse({ description: 'Email já registrado' })
  @ApiBadRequestResponse({
    description: 'Erro de validação no payload enviado',
  })
  register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @Public()
  @Post('login')
  @ApiOkResponse({
    description: 'User successfully logged in',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  @ApiBadRequestResponse({
    description: 'Erro de validação no payload enviado',
  })
  login(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }

  @Get('me')
  @ApiOkResponse({
    description: 'Returns the authenticated user',
    schema: {
      example: {
        id: 'f3087d2b-4f90-4ef4-9b4c-70b1ee1a14cb',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido ou ausente' })
  getProfile(@Req() req: any) {
    return req.user;
  }
}
