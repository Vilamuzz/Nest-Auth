// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(
      dto.email,
      dto.password,
      dto.name,
    );
    return { id: user._id, email: user.email };
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const tokens = await this.authService.getTokens(user.id, user.email);
    // If using cookies for refresh token:
    // set-cookie header here (httpOnly, secure)
    return tokens; // accessToken + refreshToken (or set refresh cookie)
  }

  //   @Post('refresh')
  //   async refresh(@Body() body: { userId: string; refreshToken: string }) {
  //     return this.authService.refreshTokens(body.userId, body.refreshToken);
  //   }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @ApiResponse({ status: 200, description: 'User logged out' })
  async logout(@Req() req) {
    await this.authService.logout(req.user.userId);
    return { ok: true };
  }
}
