import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async register(dto: RegisterDto) {
    // prevent duplicate registration
    const existing = await this.userService.findByUsername(dto.email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await this.userService.create({
      email: dto.email,
      password: hashed,
      name: dto.name,
    });

    // strip password before returning
    const data = created.toObject ? created.toObject() : created;
    const { password, ...result } = data as any;
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findByUsername(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // Generate random token
    const token = randomBytes(32).toString('hex');

    // Save token to user
    user.token = token;
    await user.save();

    return { token };
  }

  async validateToken(token: string) {
    const user = await this.userService.findByToken(token);
    if (!user) throw new UnauthorizedException('Invalid token');
    return user;
  }
}
