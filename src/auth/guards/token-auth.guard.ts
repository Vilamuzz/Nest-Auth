import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing authorization header');
    }

    // accept "Token <token>", "Bearer <token>" or raw token string
    let token: string;
    if (typeof authHeader === 'string') {
      if (authHeader.startsWith('Token ')) {
        token = authHeader.slice(6).trim();
      } else if (authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7).trim();
      } else {
        token = authHeader.trim();
      }
    } else if (Array.isArray(authHeader)) {
      // use first header value
      const first = authHeader[0] || '';
      token = first.replace(/^Token\s+|^Bearer\s+/i, '').trim();
    } else {
      throw new UnauthorizedException('Invalid authorization header');
    }

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const user = await this.authService.validateToken(token);
      request.user = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
