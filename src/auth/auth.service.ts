import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(email: string, password: string, name?: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new Error('Email already registered');
    const hashed = await bcrypt.hash(password, 12);
    const user = await this.usersService.create({
      email,
      password: hashed,
      name,
    });
    return user;
  }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(pass, user.password);
    if (!ok) return null;
    return user;
  }

  async getTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    // refresh token — generate random secret, hash it and store
    const refreshTokenPlain = randomBytes(64).toString('hex');
    const hashedRefresh = await bcrypt.hash(refreshTokenPlain, 12);

    // store hashedRefresh in DB
    await this.usersService.setHashedRefreshToken(userId, hashedRefresh);

    return {
      accessToken,
      refreshToken: refreshTokenPlain, // send plain to client once
    };
  }

  //   async refreshTokens(userId: string, refreshToken: string) {
  //     const user = await this.usersService.findById(userId);
  //     if (!user || !user.hashedRefreshToken) throw new UnauthorizedException();

  //     const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
  //     if (!isMatch) throw new UnauthorizedException();

  //     return this.getTokens(user.id, user.email);
  //   }

  async logout(userId: string) {
    await this.usersService.setHashedRefreshToken(userId, null);
  }
}
