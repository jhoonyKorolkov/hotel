import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HotelsModule } from './hotels/hotels.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConfig } from './config/database.config';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/logger-config';
import { ReservationModule } from './reservation/reservation.module';
import { SupportModule } from './support/support.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: mongoConfig,
    }),
    EventEmitterModule.forRoot(),
    WinstonModule.forRoot(winstonConfig),
    HotelsModule,
    UsersModule,
    AuthModule,
    ReservationModule,
    SupportModule,
  ],
})
export class AppModule {}
