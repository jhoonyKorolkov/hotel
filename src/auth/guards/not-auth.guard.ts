import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class NotAuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    if (req.user) {
      throw new ForbiddenException(
        'Этот ресурс доступен только для неавторизованных пользователей',
      );
    }

    return true;
  }
}
