import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/exceprions/exception.filter';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as MongoDBStore from 'connect-mongodb-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const MongoDBStoreSession = MongoDBStore(session);
  const sessionStore = new MongoDBStoreSession({
    uri: config.get<string>('MONGO_URI'),
    collection: 'sessions',
  });

  sessionStore.on('error', (error) => {
    console.error('Ошибка подключения к хранилищу сессий MongoDB:', error);
  });

  app.setGlobalPrefix(config.get<string>('HTTP_PREFIX'));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  app.use(
    session({
      secret: config.get<string>('MONGO_SECRET'),
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        maxAge: 3600000, // 1 час
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(config.get<number>('HTTP_PORT'));
}
bootstrap();
