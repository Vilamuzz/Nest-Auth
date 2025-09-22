import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CookieAuthGuard } from './guards/cookie-auth.guard';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: any) {
    return this.authService.login(body.email, body.password, res);
  }

  @UseGuards(CookieAuthGuard)
  @ApiCookieAuth('auth-cookie') // Swagger config
  @Get('me')
  async profile(@Req() req) {
    return req.user;
  }
}
