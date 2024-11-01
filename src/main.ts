import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import MongoSessionStore from '../database/store.session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix(config.get('HTTP_PREFIX'));

  const configSwagger = new DocumentBuilder()
    .setTitle(`${config.get('SERVICE_NAME')}`)
    .setDescription('API Documentation')
    .addServer(
      `http://${config.get('HTTP_HOST')}:${config.get('HTTP_PORT')}${config.get('HTTP_PREFIX')}`,
    )
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);

  SwaggerModule.setup(`${config.get('HTTP_PREFIX')}/docs`, app, document);

  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  app.use(
    session({
      secret: 'your-secret-key', // Замените на ваш секретный ключ
      resave: false,
      saveUninitialized: false,
      store: MongoSessionStore,
      cookie: {
        maxAge: 3600000, // Время жизни куки в миллисекундах
        httpOnly: true,
        secure: false, // Установите true, если используете HTTPS
        sameSite: 'lax', // Настройте в соответствии с вашими потребностями
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(config.get('HTTP_PORT'));
}
bootstrap();
