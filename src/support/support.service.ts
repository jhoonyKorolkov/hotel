import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Support, SupportDocument } from './schemas/support.schema';
import { Model, Types } from 'mongoose';
import {
  ResponseSupportTicketByManagerDto,
  ResponseSupportTicketDto,
} from './dto/response-support-ticket.dto';
import { Message, MessageDocument } from './schemas/message.shema';
import { CustomLoggerService } from '../common/logger/services/custom-logger.service';
import { SearchSupportTicketsDto } from './dto/search-support-tickets.dto';
import { IMessage } from './interfaces/message.interface';
import { IUser } from '../users/interfaces/user.interface';
import { Role } from '../auth/enums/role.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(Support.name) private supportModel: Model<SupportDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: CustomLoggerService,
  ) {}

  async createSupportTicket(id: Types.ObjectId, text: string): Promise<ResponseSupportTicketDto[]> {
    try {
      const message = await this.messageModel.create({
        author: id,
        text,
      });

      const supportRequest = await this.supportModel.create({
        user: id,
        isActive: true,
        messages: [message._id],
      });

      return [
        {
          id: supportRequest._id.toString(),
          createdAt: supportRequest.createdAt.toISOString(),
          isActive: supportRequest.isActive,
          hasNewMessages: true,
        },
      ];
    } catch (error) {
      this.logger.error('Ошибка при создании обращения', error.stack);
      throw new Error('Не удалось создать обращение');
    }
  }

  async findAllSupportTicketsByClient(
    userId: Types.ObjectId,
    params: SearchSupportTicketsDto,
  ): Promise<ResponseSupportTicketDto[]> {
    try {
      const { limit, offset, isActive } = params;

      const filter: any = { user: userId };
      if (isActive !== undefined) {
        filter.isActive = isActive;
      }

      const allTickets = await this.supportModel
        .find(filter)
        .limit(limit)
        .skip(offset)
        .sort({ createdAt: -1 })
        .populate<{ messages: IMessage[] }>('messages');

      return allTickets.map((ticket) => ({
        id: ticket._id.toString(),
        createdAt: ticket.createdAt.toISOString(),
        isActive: ticket.isActive,
        hasNewMessages: ticket.messages.some((message) => !message.readAt),
      }));
    } catch (error) {
      this.logger.error('Ошибка при получении обращений клиента', error.stack);
      throw new Error('Не удалось получить список обращений клиента');
    }
  }

  async findAllSupportTicketsByManager(
    params: SearchSupportTicketsDto,
  ): Promise<ResponseSupportTicketByManagerDto[]> {
    try {
      const { limit, offset, isActive } = params;

      const filter: any = {};
      if (isActive !== undefined) {
        filter.isActive = isActive;
      }

      const allTickets = await this.supportModel
        .find(filter)
        .limit(limit)
        .skip(offset)
        .sort({ createdAt: -1 })
        .populate<{ messages: IMessage[] }>('messages')
        .populate<{ user: IUser }>('user');

      return allTickets.map((ticket) => ({
        id: ticket._id.toString(),
        createdAt: ticket.createdAt.toISOString(),
        isActive: ticket.isActive,
        hasNewMessages: ticket.messages.some((message) => !message.readAt),
        client: {
          id: ticket.user.id.toString(),
          name: ticket.user.name,
          email: ticket.user.email,
          contactPhone: ticket.user.contactPhone,
        },
      }));
    } catch (error) {
      this.logger.error('Ошибка при получении обращений менеджера', error.stack);
      throw new Error('Не удалось получить список обращений');
    }
  }

  async getMessagesFromSupport(
    supportId: string,
    userId: Types.ObjectId,
    role: string,
  ): Promise<any[]> {
    try {
      const supportRequest = await this.validateUserAccessToChat(supportId, userId, role);

      if (!supportRequest) {
        throw new NotFoundException('Обращение не найдено');
      }

      const messages = await this.messageModel
        .find({ _id: { $in: supportRequest.messages } })
        .populate<{ author: { _id: string; name: string } }>({
          path: 'author',
          select: '_id name',
        })
        .sort({ sentAt: 1 });

      return messages.map((message) => ({
        id: message._id.toString(),
        createdAt: message.sentAt.toISOString(),
        text: message.text,
        readAt: message.readAt ? message.readAt.toISOString() : null,
        author: {
          id: message.author._id.toString(),
          name: message.author.name,
        },
      }));
    } catch (error) {
      this.logger.error('Ошибка при получении сообщений из чата', error.stack);
      throw error;
    }
  }

  async validateUserAccessToChat(supportId: string, userId: Types.ObjectId, role: string) {
    try {
      const supportRequest = await this.supportModel.findOne({ _id: supportId });

      if (!supportRequest) {
        throw new NotFoundException('Обращение не найдено');
      }

      if (role === Role.CLIENT && !supportRequest.user.equals(userId)) {
        throw new ForbiddenException('У вас нет доступа к этому обращению');
      }

      return supportRequest;
    } catch (error) {
      this.logger.error('Ошибка при проверке доступа к чату', error.stack);
      throw error;
    }
  }

  async sendMessage(chatId: string, userId: string, text: string): Promise<Message> {
    try {
      const message = await this.messageModel.create({
        author: new Types.ObjectId(userId),
        text,
        sentAt: new Date(),
      });

      const supportRequest = await this.supportModel.findByIdAndUpdate(
        chatId,
        {
          $push: { messages: message._id },
        },
        { new: true },
      );

      if (!supportRequest) {
        throw new NotFoundException('Чат не найден');
      }

      return message.toObject();
    } catch (error) {
      this.logger.error('Ошибка при отправке сообщения в чат', error.stack);
      throw error;
    }
  }

  async markMessagesAsRead(
    supportId: string,
    userId: Types.ObjectId,
    createdBefore: Date,
  ): Promise<void> {
    try {
      const supportRequest = await this.validateUserAccessToChat(supportId, userId, Role.CLIENT);

      if (!supportRequest) {
        throw new NotFoundException('Обращение не найдено');
      }

      const result = await this.messageModel.updateMany(
        {
          _id: { $in: supportRequest.messages },
          sentAt: { $lt: createdBefore },
          readAt: null,
        },
        { $set: { readAt: new Date() } },
      );

      this.eventEmitter.emit('messagesRead', {
        chatId: supportId,
        userId: userId.toString(),
        updatedCount: result.modifiedCount,
      });
    } catch (error) {
      this.logger.error('Ошибка при пометке сообщений как прочитанных', error.stack);
      throw error;
    }
  }
}
