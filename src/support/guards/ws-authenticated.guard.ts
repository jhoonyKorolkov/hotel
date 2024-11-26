import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { Role } from '../../auth/enums/role.enum';

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const { userId, role } = client.handshake.query;

    if (!userId || !role) {
      throw new UnauthorizedException('Missing userId or role');
    }

    if (role !== Role.CLIENT && role !== Role.MANAGER) {
      throw new UnauthorizedException('Invalid role');
    }

    return true;
  }
}
