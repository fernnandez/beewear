import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../../infra/auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './user.entity';

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
        name: user.name,
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
        name: user.name,
        email: user.email,
        role: user.role,
      }),
    };
  }
}
