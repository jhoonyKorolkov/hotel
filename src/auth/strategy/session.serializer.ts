// session.serializer.ts
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersService } from '../../users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  serializeUser(user: any, done: Function) {
    done(null, user.id);
  }

  async deserializeUser(id: string, done: Function) {
    console.log('Десериализация пользователя с ID:', id);
    const user = await this.usersService.findById(id);

    console.log(user);

    if (user) {
      done(null, user);
    } else {
      done(null, null);
    }
  }
}
