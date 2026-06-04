import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '../services/jwt.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { UsersService } from 'src/modules/users/users.service';
import { AuthenticatedRequest } from '../types/authenticatedrequest.type';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ١. هل المسار @Public()؟ → يمرر مباشرة
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    // ٢. مسار محمي → نتحقق من التوكن
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authHeader = request.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('errors.auth.token_invalid');
    }

    const token = authHeader.slice(7);
    const payload = this.jwtService.verify(token);

    const user = await this.usersService.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('errors.auth.account_disabled');
    }

    request.user = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return true;
  }
}
