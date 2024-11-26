import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SupportService } from './support.service';
import { Types } from 'mongoose';
import { OnEvent } from '@nestjs/event-emitter';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { WsAuthGuard } from './guards/ws-authenticated.guard';
import { Role } from '../auth/enums/role.enum';

@WebSocketGateway({
  namespace: 'support',
  cors: {
    origin: '*',
  },
})
export class SupportGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly supportService: SupportService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    const role = client.handshake.query.role;

    if (!userId || !role) {
      console.error('Неавторизованное подключение: отсутствует userId или роль');
      client.emit('error', {
        message: 'Неавторизованное подключение: отсутствует идентификатор пользователя или роль',
      });
      client.disconnect();
      return;
    }

    if (role !== Role.CLIENT && role !== Role.MANAGER) {
      console.error('Неавторизованное подключение: некорректная роль');
      client.emit('error', { message: 'Неавторизованное подключение: некорректная роль' });
      client.disconnect();
      return;
    }

    console.log(`Пользователь подключен: ${userId} с ролью: ${role}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Пользователь отключился: ${client.id}`);
  }

  afterInit(server: Server) {
    console.log('Сокет подключен и работает');
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('subscribeToChat')
  async handleSubscribeToChat(
    @MessageBody() { chatId }: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.handshake.query.userId as string;
    const role = client.handshake.query.role as string;

    try {
      await this.supportService.validateUserAccessToChat(chatId, new Types.ObjectId(userId), role);
      client.join(chatId);
      return {
        event: 'subscribeToChat',
        data: { chatId, message: 'Вы успешно подписались на чат' },
      };
    } catch (error) {
      client.emit('error', { message: `Не удалось подписаться на чат: ${error.message}` });
      console.error('Не удалось подписаться на чат:', error.message);
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() { chatId, text }: { chatId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.handshake.query.userId as string;

    try {
      const message = await this.supportService.sendMessage(chatId, userId, text);
      this.server.to(chatId).emit('newMessage', message);
      return { event: 'sendMessage', data: message };
    } catch (error) {
      client.emit('error', { message: `Ошибка отправки сообщения: ${error.message}` });
      console.error('Ошибка отправки сообщения:', error.message);
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('markMessagesAsRead')
  async handleMarkMessagesAsRead(
    @MessageBody() { chatId, createdBefore }: { chatId: string; createdBefore: string },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userId = client.handshake.query.userId as string;

    try {
      const createdBeforeDate = new Date(createdBefore);
      await this.supportService.markMessagesAsRead(
        chatId,
        new Types.ObjectId(userId),
        createdBeforeDate,
      );
      client.emit('messagesMarkedAsRead', {
        success: true,
        chatId,
        createdBefore,
      });
    } catch (error) {
      client.emit('error', {
        message: `Ошибка пометки сообщений как прочитанных: ${error.message}`,
      });
      console.error('Ошибка пометки сообщений как прочитанных:', error.message);
    }
  }

  @OnEvent('messagesRead')
  handleMessagesRead(payload: { chatId: string; userId: string; updatedCount: number }) {
    console.log('Событие получено: messagesRead', payload);

    this.server.to(payload.chatId).emit('messagesRead', {
      chatId: payload.chatId,
      userId: payload.userId,
      updatedCount: payload.updatedCount,
    });
  }
}
