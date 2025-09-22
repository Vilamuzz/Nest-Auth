import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class CookieAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies['auth-cookie'];

    if (!token) {
      throw new UnauthorizedException('Missing auth cookie');
    }

    const user = await this.authService.validateToken(token);
    request.user = user;

    return true;
  }
}
