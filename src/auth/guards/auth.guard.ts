import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if (!req.isAuthenticated() || !req.user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    return true;
  }
}
