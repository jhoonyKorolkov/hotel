import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { ManagerSupportController } from './manager-support.controller';
import { ClientSupportController } from './client-support.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Support, SupportSchema } from './schemas/support.schema';
import { Message, MessageSchema } from './schemas/message.shema';
import { LoggerModule } from '../common/logger/services/logger.module';
import { PublicSupportController } from './public-support.controller';
import { SupportGateway } from './support.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Support.name, schema: SupportSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    LoggerModule,
  ],
  controllers: [ClientSupportController, ManagerSupportController, PublicSupportController],
  providers: [SupportService, SupportGateway],
})
export class SupportModule {}
