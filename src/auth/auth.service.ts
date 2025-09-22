// auth/auth.service.ts
import { Injectable, UnauthorizedException, Response } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(username: string, password: string, res: any) {
    const user = await this.userService.findByUsername(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const token = randomBytes(32).toString('hex');
    user.token = token;
    await user.save();

    // Set cookie
    res.cookie('auth-cookie', token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS only)
      sameSite: 'strict',
    });

    return { message: 'Login successful' };
  }

  async validateToken(token: string) {
    const user = await this.userService.findByToken(token);
    if (!user) throw new UnauthorizedException('Invalid cookie token');
    return user;
  }
}
