import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from '../../infra/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private authService: AuthService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email já registrado');

    const hashedPassword = await this.authService.hashPassword(dto.password);

    const user = this.userRepo.create({ ...dto, password: hashedPassword });
    await this.userRepo.save(user);

    return {
      access_token: this.authService.generateToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (
      !user ||
      !(await this.authService.comparePassword(dto.password, user.password))
    ) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return {
      access_token: this.authService.generateToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
    };
  }
}
