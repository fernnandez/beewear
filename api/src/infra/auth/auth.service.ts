import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    console.log(password, hash);
    return bcrypt.compare(password, hash);
  }

  generateToken(payload: { sub: number; email: string; role: string }) {
    return this.jwtService.sign(payload);
  }
}
